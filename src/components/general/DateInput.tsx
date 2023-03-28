import { Component } from "react";

/**
 * Patterns for the date.
 * 
 * @param inputTemplate the pattern for the inputing date.
 * @param numsInYear number of symbols in year.
 * @param numsInMonth number of symbols in month.
 * @param numsInDay number of symbols in day.
 * @param valuesInDate num of numbers in date.
 */
export const DatePatterns = {
    datePlaceholder: "ГГГГ-ММ-ДД",
    dateLength: 10,
    inputTemplate: "(?:19|20)\[0-9\]{2}-(?:(?:0\[1-9\]|1\[0-2\])/(?:0\[1-9\]|1\[0-9\]|2\[0-9\])|(?:(?!02)(?:0\[1-9\]|1\[0-2\])/(?:30))|(?:(?:0\[13578\]|1\[02\])-31))",
    numsInYear: 4,
    numsInMonth: 2,
    numsInDay: 2,
    numOfValues: 3,
}

/**
 * Props for the date input component.
 * 
 * @param currentDate  the value of the current date.
 * @param setEntityDate  date setter for entity.
*/
interface DateInputProps {
    currentDate: string;
    setEntityDate: (newDate: string) => void;
}

/**
 * The date input component.
 * 
 * @param date  the value of the current date.
 * 
 * @return the date input component.
*/
export class DateInput extends Component<DateInputProps> {
    date: string;

    constructor(props: DateInputProps) {
        super(props);
        this.date = "";
    }

    /**
     * Rendering date input component.
     *
     * @return the date input component.
    */
    render() {
        if (this.props.currentDate !== null) {
            this.date = this.props.currentDate;
        }
        return (
            <input type="text"
                placeholder={DatePatterns.datePlaceholder}
                pattern={DatePatterns.inputTemplate}
                value={this.date}
                maxLength={DatePatterns.dateLength}
                onChange={(event) => {
                    let inputedDate = event.target.value;
                    this.props.setEntityDate(inputedDate);
                    this.date = inputedDate;
                    this.setState({ date: inputedDate });
                }}
            />
        )
    }
}