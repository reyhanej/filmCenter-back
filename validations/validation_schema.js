const joi = require("@hapi/joi");
const getMessages = function (field) {
  return {
    "string.base": `${field} وارد شده باید به صورت متن باشد`,
    "string.empty": `${field} نمی تواند خالی باشد`,
    "any.required": `${field} اجباری است`,
    "string.max": `${field} نمی تواند بیش از {{#limit}} کاراکتر باشد`,
    "string.min": `${field} باید حداقل {{#limit}} کاراکتر باشد`,
  };
};

const loginSchemaObj = {
  email: joi
    .string()
    .email()
    .lowercase()
    .required()
    .messages(getMessages("ایمیل")),
  password: joi.string().min(5).required().messages(getMessages("رمز عبور")),
};

const loginSchema = joi.object({
  ...loginSchemaObj,
});
const registerSchema = joi.object({
  ...loginSchemaObj,
  fullName: joi
    .string()
    .min(5)
    .required()
    .messages(getMessages("نام و نام خانوادگی")),
});

// const profileInfoSchema = joi.object({
//     username: joi.string().min(4),
//     fullname: joi.string().min(4)
// })
module.exports = { loginSchema, registerSchema };
