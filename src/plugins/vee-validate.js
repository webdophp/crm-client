// _field_  The field name.
// _value_  The field value that was validated.
// _rule_   The rule name that triggered this message.
import i18n from './i18n'
import { configure, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';

configure({
    defaultMessage: (_, values) => {
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})

for (let rule in rules) {
    extend(rule, rules[rule])
}

extend('length_char', {
    params: ['length'],
    validate(value, args) {
        return value.length === Number(args.length)
    },
    message: (field, values) => {
        //values._format_ = i18n.t(`validations.formats.${values._field_}`)
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})

extend('alpha_latin_num_minus', {
    validate(value) {
        var regEx = /^[a-z0-9-]+$/;
        return value.length > 0 && value.match(regEx)
    },
    message: (field, values) => {
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})

extend('link', {
    validate(value) {
        //var regEx = /^[0-9a-zA-Zа-яёА-ЯЁ\.\-\:\?\/\&\+\=\_\#]+$/;
        var regEx = /^http(s)?:\/\/[\w.-]+(?:\.[\w.-]+)+[\w-._~:/?#[\]@!$&'()*+,;=.]+$/i;
        return value.length > 0 && value.match(regEx)
    },
    message: (field, values) => {
        //values._format_ = i18n.t(`validations.formats.${values._field_}`)
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})

extend('phone', {
    validate(value) {
        var regEx = /^\+(\d{1,3}) \((\d{2,3})\) (\d{3})-(\d{2})-(\d{2})$/;
        return value.length > 0 && value.match(regEx)
    },
    message: (field, values) => {
        //values._format_ = i18n.t(`validations.formats.${values._field_}`)
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})
extend('date_format', {
    validate(value) {
        var regEx = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;
        return value.length > 0 && value.match(regEx)
    },
    message: (field, values) => {
       // values._format_ = i18n.t(`validations.formats.${values._field_}`)
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})
extend('date_time_format_hm', {
    validate(value) {
        var regEx = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2}) (\d{1,2})(\/|:)(\d{1,2})$/;
        return value.length > 0 && value.match(regEx)
    },
    message: (field, values) => {
        //values._format_ = i18n.t(`validations.formats.${values._field_}`)
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})
extend('time_format_hm', {
    validate(value) {
        var regEx = /^(\d{1,2})(\/|:)(\d{1,2})$/;
        return value.length > 0 && value.match(regEx)
    },
    message: (field, values) => {
        //values._format_ = i18n.t(`validations.formats.${values._field_}`)
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})
extend('time_format', {
    validate(value) {
        var regEx = /^(\d{1,2})(\/|:)(\d{1,2})(\/|:)(\d{1,2})$/;
        return value.length > 0 && value.match(regEx)
    },
    message: (field, values) => {
        //values._format_ = i18n.t(`validations.formats.${values._field_}`)
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})
extend('iin', {
    validate(value) {
        let iin = value;

        if (!iin) return false;
        if (iin.length !== 12) return false;
        if (!(/[0-9]{12}/.test(iin))) return false;

        //Проверяем контрольный разряд
        let b1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let b2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];
        let a = [];
        let controll = 0;
        for (let i = 0; i < 12; i++) {
            a[i] = parseInt(iin.substring(i, i + 1))
            if (i < 11) controll += a[i] * b1[i];
        }
        controll = controll % 11;
        if (controll === 10) {
            controll = 0;
            for (let i = 0; i < 11; i++)
                controll += a[i] * b2[i];
            controll = controll % 11;
        }
        if (controll !== a[11]) return false;
        return true;
    },
    message: (field, values) => {
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})
extend('bin', {
    validate(value) {
        let bin = value;

        if (!bin) return false;
        if (bin.length !== 12) return false;
        if (!(/[0-9]{12}/.test(bin))) return false;

        //Проверяем корректность даты (насколько это возможно)
        let m = parseInt(bin.substring(2, 4))
        if (m > 12) return false;

        //Проверяем контрольный разряд
        let b1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let b2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];
        let a = [];
        let controll = 0;
        for (let i = 0; i < 12; i++) {
            a[i] = parseInt(bin.substring(i, i + 1))
            if (i < 11) controll += a[i] * b1[i];
        }
        controll = controll % 11;
        if (controll === 10) {
            controll = 0;
            for (let i = 0; i < 11; i++)
                controll += a[i] * b2[i];
            controll = controll % 11;
        }
        if (controll !== a[11]) return false;
        return true;
    },
    message: (field, values) => {
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})
extend('bin_iin', {
    validate(value) {
        let bin_iin = value;

        if (!bin_iin) return false;
        if (bin_iin.length !== 12) return false;
        if (!(/[0-9]{12}/.test(bin_iin))) return false;

        let check_bin = parseInt(bin_iin.substring(4, 5))
        let is_bin = [4,5,6].includes(check_bin)

        if (is_bin) {
            //Проверяем корректность даты (насколько это возможно)
            let m = parseInt(bin_iin.substring(2, 4))
            if (m > 12) return false;
        }

        //Проверяем контрольный разряд
        let b1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let b2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];
        let a = [];
        let controll = 0;
        for (let i = 0; i < 12; i++) {
            a[i] = parseInt(bin_iin.substring(i, i + 1))
            if (i < 11) controll += a[i] * b1[i];
        }
        controll = controll % 11;
        if (controll === 10) {
            controll = 0;
            for (let i = 0; i < 11; i++)
                controll += a[i] * b2[i];
            controll = controll % 11;
        }
        if (controll !== a[11]) return false;
        return true;
    },
    message: (field, values) => {
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})

extend('boolean', {
    validate(value) {
        if (!value) return false;
        return true
    },
    message: (field, values) => {
        //values._field_ = i18n.t(`validations.fields.${values._field_}`)
        return i18n.t(`validations.rules.${values._rule_}`, values)
    }
})
