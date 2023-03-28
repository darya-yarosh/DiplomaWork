import Validator from "logic/utils/Validator";

/**
 * Handler of entity changes.
 *
 * @param updateData function of updating data after changing the value of entity.
 * @param validator validator of values.
*/
export default class EntityHandler {
    updateData: () => void;
    validator: Validator;
    constructor(updateData: () => void) {
        this.updateData = updateData;
        this.validator = new Validator();
    }

    /**
     * Handle number value with validation.
     *
     * @param newValue new valid value of number.
     * @param oldValue old value.
     * 
     * @return new valid value of number.
    */
    handleNumberWithValidation(newValue: string, oldValue: string) {
        this.updateData();
        return this.validator.getValidNumber(newValue, oldValue);
    }

    /**
     * Handle text value with validation.
     *
     * @param newValue new valid value of text.
     * @param oldValue old value.
     * 
     * @return new valid value of text.
    */
    handleTextWithValidation(newValue: string, oldValue: string) {
        this.updateData();
        return this.validator.getValidText(newValue, oldValue);
    }

    /**
     * Handle text value.
     *
     * @param newValue new value of text.
     * 
     * @return new value of text.
    */
    handleText(newValue: string) {
        this.updateData();
        return newValue;
    }

    /**
     * Handle project name of task.
     *
     * @param newValue new value of project name of task.
     * 
     * @return new project name of task.
    */
    handleProjectName(newValue: string) {
        this.updateData();
        return newValue;
    }

    /**
     * Handle status value of task.
     *
     * @param newValue new value of task status.
     * 
     * @return new status value of task.
    */
    handleStatus(newValue: string) {
        this.updateData();
        return newValue;
    }

    /**
     * Handle executor name from task.
     *
     * @param newValue new value of executor name of task.
     * 
     * @return new executor name from task.
    */
    handleExecutor(newValue: string) {
        this.updateData();
        return newValue;
    }

    /**
     * Handle start date value from task.
     *
     * @param newValue new value of start task date.
     * 
     * @return new start date value of task.
    */
    handleStartDate(newValue: string) {
        this.updateData();
        return newValue;
    }

    /**
     * Handle end date value from task.
     *
     * @param newValue new value of end task date.
     * 
     * @return new end date value of task.
    */
    handleEndDate(newValue: string) {
        this.updateData();
        return newValue;
    }
}