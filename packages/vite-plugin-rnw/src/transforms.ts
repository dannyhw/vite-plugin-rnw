/**
 * Code transformation utilities for fixing React Native package compatibility issues
 */

/**
 * Analyzes require statements in code and maps them to module imports.
 * Handles patterns like: varName = require('path').prop or require('path').default
 */
function analyzeRequireStatements(
  originalCode: string,
  exportedVars: string[]
): Map<string, string[]> {
  const importMap = new Map<string, string[]>();

  for (const varName of exportedVars) {
    // Look for patterns like: varName = require('path').prop or require('path').default
    // Search in the original code, handles multiline assignments
    const requirePattern = new RegExp(
      `${varName}\\s*=\\s*[\\s\\S]*?require\\(['"]([^'"]+)['"]\\)(?:\\.([\\w]+))?`,
      "g"
    );
    const requireMatch = requirePattern.exec(originalCode);

    if (requireMatch) {
      const [, modulePath, prop] = requireMatch;
      const key = `${modulePath}:${prop || "default"}`;
      if (!importMap.has(key)) {
        importMap.set(key, []);
      }
      importMap.get(key)!.push(varName);
    }
  }

  return importMap;
}

/**
 * Removes try/catch blocks that contain require statements and export let declarations.
 * This cleans up the problematic CommonJS patterns.
 */
function removeTryCatchRequireBlocks(code: string): string {
  // Remove all try/catch blocks that contain require statements
  let transformed = code.replace(
    /try\s*\{[^{}]*?require\([^)]+\)[^{}]*?\}\s*catch[^{}]*?\{[^{}]*?\}/gs,
    ""
  );

  // Remove all export let declarations
  transformed = transformed.replace(/export let \w+;/g, "");

  return transformed;
}

/**
 * Generates direct export statements from the import map.
 * Creates modern ESM exports like: export { default as varName } from 'module';
 */
function generateDirectExports(importMap: Map<string, string[]>): string {
  let exports = "";

  for (const [key, vars] of importMap) {
    const [modulePath, prop] = key.split(":");

    if (prop === "default") {
      // Default exports: export { default as varName } from 'module';
      for (const varName of vars) {
        exports += `export { default as ${varName} } from '${modulePath}';\n`;
      }
    } else {
      // Named exports: export { propName as varName } from 'module';
      for (const varName of vars) {
        exports += `export { ${prop} as ${varName} } from '${modulePath}';\n`;
      }
    }
  }

  return exports;
}

/**
 * Transforms React Native Reanimated webUtils files to fix problematic
 * export let + try/catch + require patterns by converting them to proper ESM.
 * 
 * This transformation handles the incompatible module patterns in React Native Reanimated
 * that cause build errors in Vite due to mixing CommonJS require() with ESM exports.
 */
export function transformReanimatedWebUtils(
  toTransform: string,
  originalCode: string,
  id: string,
  isProduction: boolean
): string {
  // Only apply transformation to React Native Reanimated webUtils files in production
  if (
    !isProduction ||
    !id.includes("node_modules/react-native-reanimated") ||
    !id.includes("ReanimatedModule/js-reanimated/webUtils") ||
    !originalCode.includes("export let") ||
    !originalCode.includes("try") ||
    !originalCode.includes("require")
  ) {
    return toTransform;
  }

  // Extract all export let variable names generically
  const exportLetMatches = Array.from(
    originalCode.matchAll(/export let (\w+);/g)
  );
  const exportedVars = exportLetMatches.map((match) => match[1]);

  if (exportedVars.length === 0) {
    return toTransform;
  }

  // Analyze require statements in original code before removing try/catch blocks
  const importMap = analyzeRequireStatements(originalCode, exportedVars);

  // Remove problematic try/catch + require patterns and export let declarations
  toTransform = removeTryCatchRequireBlocks(toTransform);

  // Generate clean direct export statements
  const exports = generateDirectExports(importMap);

  if (exports) {
    toTransform = `${toTransform}\n${exports}`;
  }

  return toTransform;
}