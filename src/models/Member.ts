import Validator from "logic/utils/Validator";
import EMPTY_INDEX from "logic/utils/EmptyIndex";

export default interface Member {
   id: string;
   lastName: string;
   firstName: string;
   middleName: string;
   status: MemberStatus;
   position: MemberPosition;
   mobileNumber: string;
   mail: string;
   address: string;
}

export const enum MemberStatus {
   active = "Активен",
   inactive = "He активен",
}

export const enum MemberPosition {
   student = "Студент",
   teacher = "Преподаватель",
   other = "Иное лицо"
}

export const enum PARAMETERS_MEMBER {
   fullName= "ФИО",
   lastName = "Фамилия",
   firstName = "Имя",
   middleName = "Отчество",
   position = "Должность",
   address = "Адрес",
   mail = "Почта",
   mobileNumber = "Мобильный телефон",
   status = "Статус",
}

export const EMPTY_MEMBER: Member = {
   id: EMPTY_INDEX,
   lastName: "",
   firstName: "",
   middleName: "",
   status: MemberStatus.inactive,
   position: MemberPosition.other,
   mobileNumber: "",
   mail: "",
   address: "",
}

export function isValidMember(member: Member): boolean {
   const validator = new Validator();
   
   const isValidStatus = validator.isValidMemberStatus(member.status);
   const isValidLastName = validator.isTextValid(member.lastName);
   const isValidFirstName = validator.isTextValid(member.firstName);
   const isValidMobileNumber = member.mobileNumber.length===0 ? true : validator.isMobileNumberValid(member.mobileNumber);
   const isValidMail = member.mail.length===0 ? true : validator.isMailValid(member.mail);

   if (!isValidStatus) window.alert("Некорректные данные в поле Статус");
   else if (!isValidFirstName) window.alert("Некорректные данные в поле Фамилия");
   else if (!isValidLastName) window.alert("Некорректные данные в поле Имя");
   else if (!isValidMobileNumber) window.alert("Некорректные данные в поле Мобильный телефон");
   else if (!isValidMail) window.alert("Некорректные данные в поле Почта");

   return (isValidFirstName && isValidLastName && isValidMobileNumber && isValidMail);
}