import { ActivityStatus } from "models/Activity";
import { MemberPosition, MemberStatus } from "models/Member";
import { ProjectStatus } from "models/Project";

const DatePatterns = {
    datePlaceholder: "ГГГГ-ММ-ДД",
    dateLength: 10,
    inputTemplate: "(?:19|20)\[0-9\]{2}-(?:(?:0\[1-9\]|1\[0-2\])/(?:0\[1-9\]|1\[0-9\]|2\[0-9\])|(?:(?!02)(?:0\[1-9\]|1\[0-2\])/(?:30))|(?:(?:0\[13578\]|1\[02\])-31))",
    numsInYear: 4,
    numsInMonth: 2,
    numsInDay: 2,
    numOfValues: 3,
}

const TextPatterns = {
    text: /^[0-9a-zA-Zа-яА-Я]/,
    letters: /[A-Za-zА-Яа-я]/,
    //tel: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
    tel: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
    mobileNumber: /^\(?[+]*([0-9]{3})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$/,
    mail: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    time: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/,
}

export const Placeholders = {
    mobileNumber: "+375-29-111-11-11",
    mail: "mail@example.com"
}

export default class Validator {
    getValidNumber(newValue: string, oldValue: string) {
        let validNumber = oldValue;

        if (this.isNumberValid(newValue)) {
            validNumber = newValue;
        }
        return validNumber;
    }

    isMobileNumberValid(value: string) {
        return TextPatterns.mobileNumber.test(value);
    }

    isMailValid(value: string) {
        return TextPatterns.mail.test(value);
    }

    isValidProjectStatus(status: string) {
        const isCorrectStatus = status === ProjectStatus.canceled
            || status === ProjectStatus.completed
            || status === ProjectStatus.inProgress
            || status === ProjectStatus.postponed
            || status === ProjectStatus.scheduled;

        return isCorrectStatus;
    }

    formatStrToProjectStatus(status: string) {
        if (status === ProjectStatus.canceled) return ProjectStatus.canceled;
        if (status === ProjectStatus.completed) return ProjectStatus.completed;
        if (status === ProjectStatus.inProgress) return ProjectStatus.inProgress;
        if (status === ProjectStatus.postponed) return ProjectStatus.postponed;
        if (status === ProjectStatus.scheduled) return ProjectStatus.scheduled;
        return ProjectStatus.canceled;
    }

    isValidMemberStatus(status: string) {
        const isCorrectStatus = status === MemberStatus.active
            || status === MemberStatus.inactive;

        return isCorrectStatus;
    }
    isValidPosition(position: string) {
        const isCorrectPosition = position === MemberPosition.student
            || position === MemberPosition.teacher
            || position === MemberPosition.other;

        return isCorrectPosition;
    }
    formatStrToMemberStatus(status: string) {
        if (status === MemberStatus.active) return MemberStatus.active;
        if (status === MemberStatus.inactive) return MemberStatus.inactive;
        return MemberStatus.inactive;
    }
    formatStrToPosition(position: string) {
        if (position === MemberPosition.student) return MemberPosition.student;
        if (position === MemberPosition.teacher) return MemberPosition.teacher;
        if (position === MemberPosition.other) return MemberPosition.other;
        return MemberPosition.other;
    }
    isValidActivityStatus(status: string) {
        const isCorrectStatus = status === ActivityStatus.canceled
            || status === ActivityStatus.completed
            || status === ActivityStatus.inProgress
            || status === ActivityStatus.postponed
            || status === ActivityStatus.scheduled;

        return isCorrectStatus;
    }
    formatStrToActivityStatus(status: string) {
        if (status === ActivityStatus.canceled) return ActivityStatus.canceled;
        if (status === ActivityStatus.completed) return ActivityStatus.completed;
        if (status === ActivityStatus.inProgress) return ActivityStatus.inProgress;
        if (status === ActivityStatus.postponed) return ActivityStatus.postponed;
        if (status === ActivityStatus.scheduled) return ActivityStatus.scheduled;
        return ActivityStatus.canceled;
    }

    isTextValid(newValue: string) {
        let isDataValid = false;

        if (this.isString(newValue) || newValue.length === 0) {
            isDataValid = true;
        }
        return isDataValid;
    }

    getValidText(newValue: string, oldValue: string) {
        let validText = oldValue;

        if (this.isTextValid(newValue)) {
            validText = newValue;
        }
        return validText;
    }

    isNumberValid(newValue: string) {
        let isDataValid = false;

        const isNumber = newValue === Number(newValue).toString();
        if (isNumber || newValue.length === 0) {
            isDataValid = true;
        }
        return isDataValid;
    }

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

    isEmpty(text: string) {
        return text !== null && text.trim() !== undefined && text.trim().length <= 0;
    }

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

    isValidTime(time: string) {
        let isValid = false;
        if (time !== null) {
            isValid = TextPatterns.time.test(time);
        }
        return isValid;
    }

    isValidDate(newDate: string) {
        let isValid = false;
        if (newDate !== null) {
            const dateTextConvertedToDate = this.convertTextToDate(newDate);
            const dateConvertedToText = this.convertDateToText(dateTextConvertedToDate);
            isValid = newDate === dateConvertedToText
        }
        return isValid;
    }

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

    formatDate(date: Date) {
        const year = date.getFullYear()
        let month: number | string = date.getMonth() + 1
        let day: number | string = date.getDate()

        if (month < 10) month = '0' + month
        if (day < 10) day = '0' + day
        const formattedDate = `${year}-${month}-${day}`
        return formattedDate;
    }

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

    isValidYear(year: string) {
        return (this.isDateMatchPatternLength(year, DatePatterns.numsInYear));
    }

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

    isDateMatchPatternLength(dateNumber: string, validLength: number) {
        let isValidLength = false;

        if (dateNumber !== undefined) {
            isValidLength = dateNumber.length === validLength;
        }

        return isValidLength;
    }

    getExistingDateNumber(dateNumber: string) {
        let existingDateNumber = dateNumber;

        if (dateNumber[0] === "0") {
            existingDateNumber = dateNumber[1];
        }
        return existingDateNumber;
    }

    isNumberInRange(number: number, startRange: number, endRange: number) {
        return (number >= startRange) && (number <= endRange);
    }

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