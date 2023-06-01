import Validator from "logic/utils/Validator";

export default class EntityHandler {
    updateData: () => void;
    validator: Validator;
    constructor(updateData: () => void) {
        this.updateData = updateData;
        this.validator = new Validator();
    }

    handleNumberWithValidation(newValue: string, oldValue: string) {
        this.updateData();
        return this.validator.getValidNumber(newValue, oldValue);
    }

    handleTextWithValidation(newValue: string, oldValue: string) {
        this.updateData();
        return this.validator.getValidText(newValue, oldValue);
    }

    handleText(newValue: string) {
        this.updateData();
        return newValue;
    }

    handleProjectName(newValue: string) {
        this.updateData();
        return newValue;
    }

    handleStatus(newValue: string) {
        this.updateData();
        return newValue;
    }

    handleExecutor(newValue: string) {
        this.updateData();
        return newValue;
    }

    handleStartDate(newValue: string) {
        this.updateData();
        return newValue;
    }

    handleEndDate(newValue: string) {
        this.updateData();
        return newValue;
    }
}