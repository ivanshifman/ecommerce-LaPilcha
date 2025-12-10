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

  @Prop({ trim: true, match: /^\+?[1-9]\d{7,14}$/ })
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

  @Prop({ select: false, index: true })
  resetPasswordToken?: string;

  @Prop({ select: false })
  resetPasswordExpires?: Date;

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
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index(
  { 'oauthProviders.google': 1 },
  {
    sparse: true,
    unique: true,
    partialFilterExpression: { deletedAt: { $exists: false } },
  },
);
UserSchema.index(
  { 'oauthProviders.apple': 1 },
  {
    sparse: true,
    unique: true,
    partialFilterExpression: { deletedAt: { $exists: false } },
  },
);

UserSchema.pre('save', function (next) {
  if (this.authProvider === AuthProvider.LOCAL && this.isNew && !this.password) {
    return next(new Error('La contraseña es obligatoria para usuarios locales'));
  }

  if (this.authProvider !== AuthProvider.LOCAL) {
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
