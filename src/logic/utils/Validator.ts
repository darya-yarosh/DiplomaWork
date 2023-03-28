import { DatePatterns } from "components/general/DateInput";

/**
 * Patterns for the text.
 *
 * @param text the pattern for the text.
 * @param letters the pattern of letters.
*/
const TextPatterns = {
    text: /^[0-9a-zA-Zа-яА-Я]/,
    letters: /[A-Za-zА-Яа-я]/,
}

/**
 * Validator of values.
*/
export default class Validator {
    /**
     * Getting of text after validating.
     *
     * @param newValue new value for validation.
     * @param oldValue old valid value.
     * 
     * @return valid text.
    */
    getValidText(newValue: string, oldValue: string) {
        let validText = oldValue;

        if (this.isTextValid(newValue)) {
            validText = newValue;
        }
        return validText;
    }

    /**
     * Getting of number after validating.
     *
     * @param newValue new value for validation.
     * @param oldValue old valid value.
     * 
     * @return valid number.
    */
    getValidNumber(newValue: string, oldValue: string) {
        let validNumber = oldValue;

        if (this.isNumberValid(newValue)) {
            validNumber = newValue;
        }
        return validNumber;
    }

    /**
     * Checking text is valid.
     *
     * @param newValue new value for validation
     * 
     * @return true if text is valid. false if text is invalid.
    */
    isTextValid(newValue: string) {
        let isDataValid = false;

        if (this.isString(newValue) || newValue.length === 0) {
            isDataValid = true;
        }
        return isDataValid;
    }

    /**
     * Checking number is valid.
     *
     * @param newValue new value for validation
     * 
     * @return true if number is valid. false if number is invalid.
    */
    isNumberValid(newValue: string) {
        let isDataValid = false;

        const isNumber = newValue === Number(newValue).toString();
        if (isNumber || newValue.length === 0) {
            isDataValid = true;
        }
        return isDataValid;
    }

    /**
     * Checking text is string after validation.
     *
     * @param text text for validation
     * 
     * @return true if text is string. false if text is not string.
    */
    isString(text: string) {
        let isString = true;

        const splittedText = text.split('');
        splittedText.forEach((symbol) => {
            const isNotFitPatternOfLetters = !symbol.match(TextPatterns.letters);
            if (isNotFitPatternOfLetters) {
                isString = false;
            }
        })
        return isString;
    }

    /**
     * Checking text is empty.
     *
     * @param text text for validation.
     * 
     * @return true if text is empty. false if text is not empty.
    */
    isEmpty(text: string) {
        return text !== null && text.trim() !== undefined && text.trim().length <= 0;
    }

    /**
     * Comparing text with a number.
     *
     * @param text text for validation.
     * @param number number for validation.
     * 
     * @return true if text and number the same. false if text and number not the same.
    */
    isTextIsNum(text: string, number: number) {
        let isTextIsNum = false;

        if (text === number.toString()) {
            isTextIsNum = true;
        }

        // A string 0 is added to comply with the 'MM' pattern if the month is less than 10.
        if (number < 10) {
            if (text === "0" + number.toString()) {
                isTextIsNum = true;
            }
        }
        return isTextIsNum;
    }

    /**
     * Checking new date is valid.
     *
     * @param newDate converted and checked string date.
     * 
     * @return true if date is valid. false if date is invalid.
    */
    isValidDate(newDate: string) {
        let isValid = false;
        if (newDate !== null) {
            const dateTextConvertedToDate = this.convertTextToDate(newDate);
            const dateConvertedToText = this.convertDateToText(dateTextConvertedToDate);
            isValid = newDate === dateConvertedToText
        }
        return isValid;
    }

    /**
     * Converting date to text type with YYYY-MM-DD pattern.
     *
     * @param date date value for conferting.
     * 
     * @return value of converted text to date.
    */
    convertDateToText(date: Date) {
        // A string 0 is added to comply with the 'MM' pattern if the month is less than 10.
        let newDateMonth = (date.getMonth() + 1).toString();
        const isNotFitPatternOfNumsInMonth = newDateMonth.length < DatePatterns.numsInMonth;
        if (isNotFitPatternOfNumsInMonth) {
            newDateMonth = "0" + newDateMonth;
        }

        // A string 0 is added to comply with the 'DD' pattern if the day is less than 10.
        let newDateDay = date.getDate().toString();
        const isNotFitPatternOfNumsInDay = newDateDay.length < DatePatterns.numsInDay;
        if (isNotFitPatternOfNumsInDay) {
            newDateDay = "0" + newDateDay;
        }

        // Date pattern is "YYYY-MM-DD".
        const newDateYear = date.getFullYear().toString();
        const textDate = newDateYear + "-" + newDateMonth + "-" + newDateDay;
        return textDate;
    }

    /**
     * Converting text of date to date type.
     *
     * @param date string date value for conferting.
     * 
     * @return value of converted text to date.
    */
    convertTextToDate(date: string) {
        let newDate = new Date();

        const splittedDateNums = date.split("-", DatePatterns.numOfValues);
        const isFitPatternOfDateNumsOfValues = this.isArrayIsNum(splittedDateNums, DatePatterns.numOfValues);
        if (isFitPatternOfDateNumsOfValues) {
            const isNumsIsUndefined = splittedDateNums[0] === undefined
                || splittedDateNums[1] === undefined
                || splittedDateNums[2] === undefined;
            if (isNumsIsUndefined) {
                return newDate;
            }

            const year = splittedDateNums[0];
            const isYear = this.isValidYear(year);

            const month = (splittedDateNums[1]);
            const isMonth = this.isValidMonth(month);

            const day = (splittedDateNums[2]);
            const isDay = this.isValidDay(day);

            const isCorrectDateValues = isYear && isMonth && isDay;
            if (isCorrectDateValues) {
                const monthIndex = Number(month) - 1;
                const date = new Date(Number(year), monthIndex, Number(day));
                return date;
            }
        }
        return newDate;
    }

    /**
     * Checking whether an array consists of numbers. 
     *
     * @param numbers array for validation.
     * @param arrayLength length of array.
     * 
     * @return true if array consists of numbers. false if array not consists of numbers.
    */
    isArrayIsNum(numbers: string[], arrayLength: number) {
        let ifArrayIsNum = true;

        let ifValuesAreNumbers: boolean[] = [];
        if (numbers.length === arrayLength) {
            ifValuesAreNumbers = numbers.map((number: string) => {
                if (this.isTextIsNum(number, Number(number))) {
                    return true;
                }
                return false;
            })
        }

        ifValuesAreNumbers.forEach((isNumber) => {
            if (isNumber === false) {
                ifArrayIsNum = false;
                return;
            }
        })
        return ifArrayIsNum;
    }

    /**
     * Checking the year for validity.
     *
     * @param year year for validation.
     * 
     * @return true if year is valid. false if year is invalid.
    */
    isValidYear(year: string) {
        return (this.isDateMatchPatternLength(year, DatePatterns.numsInYear));
    }

    /**
     * Checking the month for validity.
     *
     * @param month month for validation.
     * 
     * @return true if month is valid. false if month is invalid.
    */
    isValidMonth(month: string) {
        let isValidMonth = false;

        if (this.isDateMatchPatternLength(month, DatePatterns.numsInMonth)) {
            let existingMonth = Number(this.getExistingDateNumber(month));

            const firstYearMonth = 1;
            const lastYearMonth = 12;
            isValidMonth = this.isNumberInRange(existingMonth, firstYearMonth, lastYearMonth);
        }
        return isValidMonth;
    }

    /**
     * Checking the day for validity.
     *
     * @param day day for validation.
     * 
     * @return true if day is valid. false if day is invalid.
    */
    isValidDay(day: string) {
        let isValidDay = false;
        if (this.isDateMatchPatternLength(day, DatePatterns.numsInDay)) {
            let existingDay = Number(this.getExistingDateNumber(day));

            const firstMonthDay = 1;
            const lastMonthDay = 31;
            isValidDay = this.isNumberInRange(existingDay, firstMonthDay, lastMonthDay);
        }
        return isValidDay;
    }

    /**
     * Checking whether the date matches the pattern length.
     * 
     * @param dateNumber date number.
     * @param validLength pattern of valid length.
     * 
     * @return true if date number is valid. false if date number is invalid.
     */
    isDateMatchPatternLength(dateNumber: string, validLength: number) {
        let isValidLength = false;

        if (dateNumber !== undefined) {
            isValidLength = dateNumber.length === validLength;
        }

        return isValidLength;
    }

    /**
     * Getting the existing date number.
     * 
     * @param dateNumber number of date.
     * 
     * @return valid number of date.
     */
    getExistingDateNumber(dateNumber: string) {
        let existingDateNumber = dateNumber;

        if (dateNumber[0] === "0") {
            existingDateNumber = dateNumber[1];
        }
        return existingDateNumber;
    }

    /**
     * Checking whether the number is in the right range. 
     * 
     * @param number number for checking.
     * @param startRange start of range.
     * @param endRange end of range.
     * 
     * @return true if number in range. false if number is not in range.
     */
    isNumberInRange(number: number, startRange: number, endRange: number) {
        return (number >= startRange) && (number <= endRange);
    }

    /**
    * Getting object with trimmed parameters.
    * 
    * @param object object for trim.
    * 
    * @return converted object.
    */
    getTrimmedObject(object: Object) {
        let trimmedObject = { ...object };

        Object.keys(trimmedObject).forEach((key) => {
            //@ts-ignore
            if (trimmedObject[key] !== null) {
                //@ts-ignore
                object[key] = trimmedObject[key].toString().trim();
            }
            else {
                //@ts-ignore
                object[key] = "";
            }
        })

        return object;
    }
}