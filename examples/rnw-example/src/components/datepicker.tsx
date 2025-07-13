import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { SafeAreaView } from "react-native";

export const DatePicker = () => {
  const [date, setDate] = useState(new Date(1598051730000));

  const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;
    const currentDate = selectedDate;

    setDate(currentDate);
  };

  return (
    <SafeAreaView>
      {/* this basically just exists to show that stripping flow types works */}
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode="date"
        is24Hour={true}
        onChange={onChange}
      />
    </SafeAreaView>
  );
};
