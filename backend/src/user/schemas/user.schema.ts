import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRole } from '../common/enums/userRole.enum';
import { AuthProvider } from '../common/enums/authProvider.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false, collection: 'users' })
export class User {
  @Prop({ required: true, minlength: 3, maxlength: 255 })
  name!: string;

  @Prop({ required: false, minlength: 3, maxlength: 255 })
  lastName?: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email!: string;

  @Prop({ select: false, trim: true, minlength: 6 })
  password?: string;

  @Prop({ trim: true, match: /^\+[1-9]\d{7,14}$/ })
  phone?: string;

  @Prop()
  avatar?: string;

  @Prop({
    enum: Object.values(UserRole),
    default: 'customer',
    index: true,
  })
  role!: UserRole;

  @Prop({ default: true, index: true })
  isActive!: boolean;

  @Prop({ default: false })
  emailVerified!: boolean;

  @Prop({ select: false })
  refreshTokenHash?: string;

  @Prop({ type: String, select: false, index: true, default: null })
  resetPasswordToken?: string | null;

  @Prop({ type: Date, select: false, default: null })
  resetPasswordExpires?: Date | null;

  @Prop({
    type: {
      google: { type: String, sparse: true },
      apple: { type: String, sparse: true },
    },
    _id: false,
  })
  oauthProviders?: {
    google?: string;
    apple?: string;
  };

  @Prop({
    enum: Object.values(AuthProvider),
    default: AuthProvider.LOCAL,
  })
  authProvider!: AuthProvider;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Product' }],
    default: [],
  })
  wishlist!: Types.ObjectId[];

  @Prop({
    type: {
      defaultSize: String,
      favoriteColors: [String],
    },
    _id: false,
  })
  preferences?: {
    defaultSize?: string;
    favoriteColors?: string[];
  };

  @Prop()
  lastLogin?: Date;

  @Prop({ default: 0, min: 0 })
  totalOrders!: number;

  @Prop({ default: 0, min: 0 })
  totalSpent!: number;

  @Prop()
  deletedAt?: Date;

  @Prop({ select: false })
  emailVerificationCode?: string;

  @Prop({ select: false })
  emailVerificationExpires?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (this.authProvider === AuthProvider.LOCAL && this.isNew && !this.password) {
    return next(new Error('La contraseña es obligatoria para usuarios locales'));
  }

  if (this.isNew && this.authProvider !== AuthProvider.LOCAL) {
    this.emailVerified = true;
  }

  next();
});

UserSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password;
    delete ret.refreshTokenHash;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    return ret;
  },
});
