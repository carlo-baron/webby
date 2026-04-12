import mongoose from 'mongoose'; 
import validator from 'validator'; 
import bcrypt from 'bcryptjs';
const SALT_ROUNDS = 10;
import type { IUser } from '#root/types/userTypes.js';
import { 
	badInput,
} from '#root/lib/errorHelper.js';

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        unique: true,
        required: true,
        minLength: [3, 'Name must be 3 letters or more'],
        maxLength: [10, 'The name must be less than 10']
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        default: null
    },
		googleid: {
			type: String,
			unique: true,
			sparse: true,
		},
		profilePicture: {
			type: String,
		},
    password: {
        type: String,
        required: function(this: IUser){
					return !this.googleid;
				},
        minLength: [8, "Password must be 8 or more characters"],
        validate: {
            validator: function(val: string){
								if(!val) return true;
                const passwordRegex = new RegExp(
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]{8,}$"
                );

                const isValid = passwordRegex.test(val);
                if(!isValid){
                    this.invalidate('password', 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.', val);
                }

                return isValid;
            },
        },
        select: false
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    tokenVersion: {
        type: Number,
        default: 0,
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function (next) {
    const user = this as IUser;

    if(user.email && validator.isEmail(user.email)){
        const normalized = validator.normalizeEmail(user.email);
        user.email = normalized || null;
    }else if(user.email && !validator.isEmail(user.email)){
        return next(badInput("Invalid email."));
    }else{
        user.email = null;
    }

    try {
        if (!user.isModified('password')) return next();

        const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
        user.password = hash;
        next();
    } catch (err) {
        if(!(err instanceof Error)) return;
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean>{
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.login = function(this: IUser){
    this.isLoggedIn = true;
    return this.save();
}

userSchema.methods.logout = function(this: IUser){
    this.isLoggedIn = false;
    return this.save();
}

userSchema.methods.incrementTokenVersion = function(this: IUser){
    this.tokenVersion += 1;
    return this.save();
}

const User = mongoose.model<IUser>('User', userSchema);
export default User;
