import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    name: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBatchBatch extends Schema.CollectionType {
  collectionName: 'batches';
  info: {
    singularName: 'batch';
    pluralName: 'batches';
    displayName: 'Batch';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    date: Attribute.Date;
    warehouse: Attribute.Relation<
      'api::batch.batch',
      'manyToOne',
      'api::warehouse.warehouse'
    >;
    description: Attribute.Text;
    oil_category: Attribute.Relation<
      'api::batch.batch',
      'oneToOne',
      'api::oil-category.oil-category'
    >;
    total_weight: Attribute.Float & Attribute.DefaultTo<0>;
    out_transports: Attribute.Relation<
      'api::batch.batch',
      'oneToMany',
      'api::transport.transport'
    >;
    in_transports: Attribute.Relation<
      'api::batch.batch',
      'oneToMany',
      'api::transport.transport'
    >;
    total_cost: Attribute.Decimal & Attribute.DefaultTo<0>;
    weighings: Attribute.Relation<
      'api::batch.batch',
      'oneToMany',
      'api::weighing.weighing'
    >;
    olive_extraction: Attribute.Float;
    oils: Attribute.Relation<'api::batch.batch', 'oneToMany', 'api::oil.oil'>;
    transport_oils: Attribute.Relation<
      'api::batch.batch',
      'oneToMany',
      'api::transport-oil.transport-oil'
    >;
    canceled_weighings: Attribute.Relation<
      'api::batch.batch',
      'oneToMany',
      'api::canceled-weighing.canceled-weighing'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::batch.batch',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::batch.batch',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBeneficaryBeneficary extends Schema.CollectionType {
  collectionName: 'beneficaries';
  info: {
    singularName: 'beneficary';
    pluralName: 'beneficaries';
    displayName: 'Beneficary';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    cash_transactions: Attribute.Relation<
      'api::beneficary.beneficary',
      'oneToMany',
      'api::cash-transaction.cash-transaction'
    >;
    employee: Attribute.Relation<
      'api::beneficary.beneficary',
      'oneToOne',
      'api::employee.employee'
    >;
    provider: Attribute.Relation<
      'api::beneficary.beneficary',
      'oneToOne',
      'api::provider.provider'
    >;
    customer: Attribute.Relation<
      'api::beneficary.beneficary',
      'oneToOne',
      'api::customer.customer'
    >;
    warehouse: Attribute.Relation<
      'api::beneficary.beneficary',
      'manyToOne',
      'api::warehouse.warehouse'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::beneficary.beneficary',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::beneficary.beneficary',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCanceledWeighingCanceledWeighing
  extends Schema.CollectionType {
  collectionName: 'canceled_weighings';
  info: {
    singularName: 'canceled-weighing';
    pluralName: 'canceled-weighings';
    displayName: 'Canceled weighing';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    gross: Attribute.Decimal;
    extruction_rate: Attribute.Decimal;
    unit_price: Attribute.Float;
    tare: Attribute.Decimal;
    total_price: Attribute.Float;
    net: Attribute.Decimal;
    hab: Attribute.Float;
    dal: Attribute.Float;
    batch: Attribute.Relation<
      'api::canceled-weighing.canceled-weighing',
      'manyToOne',
      'api::batch.batch'
    >;
    procurement: Attribute.Relation<
      'api::canceled-weighing.canceled-weighing',
      'manyToOne',
      'api::procurement.procurement'
    >;
    tax: Attribute.Float;
    cash_transaction: Attribute.Relation<
      'api::canceled-weighing.canceled-weighing',
      'oneToOne',
      'api::cash-transaction.cash-transaction'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::canceled-weighing.canceled-weighing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::canceled-weighing.canceled-weighing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCashTransactionCashTransaction
  extends Schema.CollectionType {
  collectionName: 'cash_transactions';
  info: {
    singularName: 'cash-transaction';
    pluralName: 'cash-transactions';
    displayName: 'Cash Transaction';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    user: Attribute.Relation<
      'api::cash-transaction.cash-transaction',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    amount: Attribute.Float;
    warehouse: Attribute.Relation<
      'api::cash-transaction.cash-transaction',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    oldBeneficiary: Attribute.String;
    comment: Attribute.Text;
    payment_category: Attribute.Relation<
      'api::cash-transaction.cash-transaction',
      'manyToOne',
      'api::payment-category.payment-category'
    >;
    type: Attribute.Enumeration<['CASH', 'CHEQUE', 'TRANSFER', 'EFFECT']>;
    date: Attribute.DateTime;
    employee_payment: Attribute.Relation<
      'api::cash-transaction.cash-transaction',
      'oneToOne',
      'api::employee-payment.employee-payment'
    >;
    beneficiary: Attribute.Relation<
      'api::cash-transaction.cash-transaction',
      'manyToOne',
      'api::beneficary.beneficary'
    >;
    weighing: Attribute.Relation<
      'api::cash-transaction.cash-transaction',
      'oneToOne',
      'api::weighing.weighing'
    >;
    num_cheque: Attribute.String;
    name_bank: Attribute.String;
    employee: Attribute.Relation<
      'api::cash-transaction.cash-transaction',
      'oneToOne',
      'api::employee.employee'
    >;
    canceled_weighing: Attribute.Relation<
      'api::cash-transaction.cash-transaction',
      'oneToOne',
      'api::canceled-weighing.canceled-weighing'
    >;
    procurement_payment: Attribute.Relation<
      'api::cash-transaction.cash-transaction',
      'manyToOne',
      'api::procurement-payment.procurement-payment'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::cash-transaction.cash-transaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::cash-transaction.cash-transaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCashValidationCashValidation extends Schema.CollectionType {
  collectionName: 'cash_validations';
  info: {
    singularName: 'cash-validation';
    pluralName: 'cash-validations';
    displayName: 'cash Validation';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cash: Attribute.Decimal;
    real_cash: Attribute.Decimal;
    date: Attribute.Date;
    warehouse: Attribute.Relation<
      'api::cash-validation.cash-validation',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::cash-validation.cash-validation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::cash-validation.cash-validation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContainerContainer extends Schema.CollectionType {
  collectionName: 'containers';
  info: {
    singularName: 'container';
    pluralName: 'containers';
    displayName: 'Container';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    size: Attribute.Decimal;
    warehouse: Attribute.Relation<
      'api::container.container',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    pile_bottoms: Attribute.Relation<
      'api::container.container',
      'oneToMany',
      'api::pile-bottom.pile-bottom'
    >;
    production_orders: Attribute.Relation<
      'api::container.container',
      'manyToMany',
      'api::production-order.production-order'
    >;
    state: Attribute.Enumeration<['ON', 'OFF']> & Attribute.DefaultTo<'OFF'>;
    indicators: Attribute.BigInteger;
    oils: Attribute.Relation<
      'api::container.container',
      'oneToMany',
      'api::oil.oil'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::container.container',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::container.container',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCustomerCustomer extends Schema.CollectionType {
  collectionName: 'customers';
  info: {
    singularName: 'customer';
    pluralName: 'customers';
    displayName: 'Customer';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    details: Attribute.Text;
    sales: Attribute.Relation<
      'api::customer.customer',
      'oneToMany',
      'api::sale.sale'
    >;
    matricule: Attribute.String;
    sale_payements: Attribute.Relation<
      'api::customer.customer',
      'oneToMany',
      'api::sale-payement.sale-payement'
    >;
    tel: Attribute.String;
    invoices: Attribute.Relation<
      'api::customer.customer',
      'oneToMany',
      'api::invoice.invoice'
    >;
    beneficary: Attribute.Relation<
      'api::customer.customer',
      'oneToOne',
      'api::beneficary.beneficary'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::customer.customer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::customer.customer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCustomerPaymentCustomerPayment
  extends Schema.CollectionType {
  collectionName: 'customer_payments';
  info: {
    singularName: 'customer-payment';
    pluralName: 'customer-payments';
    displayName: 'Customer Payment';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Attribute.Decimal & Attribute.Required & Attribute.DefaultTo<0>;
    customer: Attribute.Relation<
      'api::customer-payment.customer-payment',
      'oneToOne',
      'api::customer.customer'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::customer-payment.customer-payment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::customer-payment.customer-payment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDefaultDefault extends Schema.SingleType {
  collectionName: 'defaults';
  info: {
    singularName: 'default';
    pluralName: 'defaults';
    displayName: 'Default';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    oil_base_price: Attribute.Float;
    olive_procurement_tax: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::default.default',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::default.default',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEmployeeEmployee extends Schema.CollectionType {
  collectionName: 'employees';
  info: {
    singularName: 'employee';
    pluralName: 'employees';
    displayName: 'Employee';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    hourly_rate: Attribute.Decimal;
    phone: Attribute.String;
    total_salary: Attribute.Decimal;
    total_seconds: Attribute.Decimal;
    total_paid: Attribute.Decimal;
    timesheets: Attribute.Relation<
      'api::employee.employee',
      'oneToMany',
      'api::timesheet.timesheet'
    >;
    total_balance: Attribute.Decimal;
    cin: Attribute.String;
    cnss: Attribute.String;
    employee_payments: Attribute.Relation<
      'api::employee.employee',
      'oneToMany',
      'api::employee-payment.employee-payment'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::employee.employee',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::employee.employee',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEmployeePaymentEmployeePayment
  extends Schema.CollectionType {
  collectionName: 'employee_payments';
  info: {
    singularName: 'employee-payment';
    pluralName: 'employee-payments';
    displayName: 'Employee Payment';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    payment: Attribute.Decimal;
    type: Attribute.Enumeration<['CASH', 'CHEQUE', 'TRANSFER', 'EFFECT']> &
      Attribute.DefaultTo<'CASH'>;
    warehouse: Attribute.Relation<
      'api::employee-payment.employee-payment',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    cash_transaction: Attribute.Relation<
      'api::employee-payment.employee-payment',
      'oneToOne',
      'api::cash-transaction.cash-transaction'
    >;
    user: Attribute.Relation<
      'api::employee-payment.employee-payment',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    comment: Attribute.String;
    employee: Attribute.Relation<
      'api::employee-payment.employee-payment',
      'manyToOne',
      'api::employee.employee'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::employee-payment.employee-payment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::employee-payment.employee-payment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHistoryHistory extends Schema.CollectionType {
  collectionName: 'histories';
  info: {
    singularName: 'history';
    pluralName: 'histories';
    displayName: 'History';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    event: Attribute.JSON;
    user: Attribute.Relation<
      'api::history.history',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    collection_type: Attribute.String;
    collection_item_id: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::history.history',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::history.history',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvoiceInvoice extends Schema.CollectionType {
  collectionName: 'invoices';
  info: {
    singularName: 'invoice';
    pluralName: 'invoices';
    displayName: 'Invoice';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    customer: Attribute.Relation<
      'api::invoice.invoice',
      'manyToOne',
      'api::customer.customer'
    >;
    sales: Attribute.Relation<
      'api::invoice.invoice',
      'oneToMany',
      'api::sale.sale'
    >;
    notice: Attribute.String;
    tva: Attribute.Float;
    unit_price: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invoice.invoice',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invoice.invoice',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMachineMachine extends Schema.CollectionType {
  collectionName: 'machines';
  info: {
    singularName: 'machine';
    pluralName: 'machines';
    displayName: 'Machine';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    ref: Attribute.String;
    state: Attribute.Enumeration<['ON', 'OFF']>;
    production_orders: Attribute.Relation<
      'api::machine.machine',
      'oneToMany',
      'api::production-order.production-order'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::machine.machine',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::machine.machine',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOilOil extends Schema.CollectionType {
  collectionName: 'oils';
  info: {
    singularName: 'oil';
    pluralName: 'oils';
    displayName: 'Oil';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    batch: Attribute.Relation<'api::oil.oil', 'manyToOne', 'api::batch.batch'>;
    container: Attribute.Relation<
      'api::oil.oil',
      'manyToOne',
      'api::container.container'
    >;
    weight: Attribute.Float & Attribute.Required;
    unit_cost: Attribute.Decimal;
    tank: Attribute.Relation<'api::oil.oil', 'manyToOne', 'api::tank.tank'>;
    production_order_container: Attribute.Relation<
      'api::oil.oil',
      'manyToOne',
      'api::production-order-container.production-order-container'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::oil.oil', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::oil.oil', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiOilCategoryOilCategory extends Schema.CollectionType {
  collectionName: 'oil_categories';
  info: {
    singularName: 'oil-category';
    pluralName: 'oil-categories';
    displayName: 'Oil Category';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    color: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::oil-category.oil-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::oil-category.oil-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOrderOrder extends Schema.CollectionType {
  collectionName: 'orders';
  info: {
    singularName: 'order';
    pluralName: 'orders';
    displayName: 'Order';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    oil: Attribute.Relation<'api::order.order', 'oneToOne', 'api::oil.oil'>;
    quantity: Attribute.Decimal;
    customer: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'api::customer.customer'
    >;
    delivered_quantity: Attribute.Decimal & Attribute.DefaultTo<0>;
    quantity_diff: Attribute.Decimal & Attribute.DefaultTo<0>;
    unit_price: Attribute.Float & Attribute.DefaultTo<0>;
    type: Attribute.Enumeration<['OIL', 'POMACE', 'PIT', 'AOULA']> &
      Attribute.DefaultTo<'OIL'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPaymentCategoryPaymentCategory
  extends Schema.CollectionType {
  collectionName: 'payment_categories';
  info: {
    singularName: 'payment-category';
    pluralName: 'payment-categories';
    displayName: 'Payment Category';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.Text;
    color: Attribute.String;
    type: Attribute.Enumeration<['IN', 'OUT']>;
    is_locked: Attribute.Boolean & Attribute.DefaultTo<false>;
    warehouse: Attribute.Relation<
      'api::payment-category.payment-category',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    cash_transactions: Attribute.Relation<
      'api::payment-category.payment-category',
      'oneToMany',
      'api::cash-transaction.cash-transaction'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::payment-category.payment-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::payment-category.payment-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPileBottomPileBottom extends Schema.CollectionType {
  collectionName: 'pile_bottoms';
  info: {
    singularName: 'pile-bottom';
    pluralName: 'pile-bottoms';
    displayName: 'Pile Bottom';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    quantity: Attribute.Decimal & Attribute.Required & Attribute.DefaultTo<0>;
    container: Attribute.Relation<
      'api::pile-bottom.pile-bottom',
      'manyToOne',
      'api::container.container'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::pile-bottom.pile-bottom',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::pile-bottom.pile-bottom',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProcurementProcurement extends Schema.CollectionType {
  collectionName: 'procurements';
  info: {
    singularName: 'procurement';
    pluralName: 'procurements';
    displayName: 'Procurement';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    weighings: Attribute.Relation<
      'api::procurement.procurement',
      'oneToMany',
      'api::weighing.weighing'
    >;
    provider: Attribute.Relation<
      'api::procurement.procurement',
      'manyToOne',
      'api::provider.provider'
    >;
    warehouse: Attribute.Relation<
      'api::procurement.procurement',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    total_price: Attribute.Float & Attribute.DefaultTo<0>;
    total_net_weight: Attribute.Float & Attribute.DefaultTo<0>;
    state: Attribute.Enumeration<
      ['IN_PROGRESS', 'PAID', 'CANCELED', 'CANCELED_PAID']
    >;
    plate_number: Attribute.String;
    number: Attribute.BigInteger;
    net_price: Attribute.Float;
    total_price_provider: Attribute.Float;
    canceled_weighings: Attribute.Relation<
      'api::procurement.procurement',
      'oneToMany',
      'api::canceled-weighing.canceled-weighing'
    >;
    procurement_payment: Attribute.Relation<
      'api::procurement.procurement',
      'manyToOne',
      'api::procurement-payment.procurement-payment'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::procurement.procurement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::procurement.procurement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProcurementPaymentProcurementPayment
  extends Schema.CollectionType {
  collectionName: 'procurement_payments';
  info: {
    singularName: 'procurement-payment';
    pluralName: 'procurement-payments';
    displayName: 'Procurement Payment';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    type: Attribute.Enumeration<['CASH', 'CHEQUE', 'TRANSFER', 'EFFECT']> &
      Attribute.DefaultTo<'CASH'>;
    number: Attribute.String;
    value: Attribute.Float;
    provider: Attribute.Relation<
      'api::procurement-payment.procurement-payment',
      'oneToOne',
      'api::provider.provider'
    >;
    comment: Attribute.Text;
    warehouse: Attribute.Relation<
      'api::procurement-payment.procurement-payment',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    user: Attribute.Relation<
      'api::procurement-payment.procurement-payment',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    procurements: Attribute.Relation<
      'api::procurement-payment.procurement-payment',
      'oneToMany',
      'api::procurement.procurement'
    >;
    cash_transactions: Attribute.Relation<
      'api::procurement-payment.procurement-payment',
      'oneToMany',
      'api::cash-transaction.cash-transaction'
    >;
    name_bank: Attribute.String;
    num_cheque: Attribute.String;
    date_creation: Attribute.DateTime;
    date_failure: Attribute.DateTime;
    interest: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::procurement-payment.procurement-payment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::procurement-payment.procurement-payment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductionOrderProductionOrder
  extends Schema.CollectionType {
  collectionName: 'production_orders';
  info: {
    singularName: 'production-order';
    pluralName: 'production-orders';
    displayName: 'ProductionOrder';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    batch: Attribute.Relation<
      'api::production-order.production-order',
      'oneToOne',
      'api::batch.batch'
    >;
    containers: Attribute.Relation<
      'api::production-order.production-order',
      'manyToMany',
      'api::container.container'
    >;
    time: Attribute.DateTime;
    machine: Attribute.Relation<
      'api::production-order.production-order',
      'manyToOne',
      'api::machine.machine'
    >;
    production_order_containers: Attribute.Relation<
      'api::production-order.production-order',
      'oneToMany',
      'api::production-order-container.production-order-container'
    >;
    state: Attribute.Enumeration<['DEFAULT', 'ON', 'OFF']> &
      Attribute.DefaultTo<'DEFAULT'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::production-order.production-order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::production-order.production-order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductionOrderContainerProductionOrderContainer
  extends Schema.CollectionType {
  collectionName: 'production_order_containers';
  info: {
    singularName: 'production-order-container';
    pluralName: 'production-order-containers';
    displayName: 'ProductionOrderContainer';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    container: Attribute.Relation<
      'api::production-order-container.production-order-container',
      'oneToOne',
      'api::container.container'
    >;
    state: Attribute.Enumeration<['OFF', 'ON']>;
    production_order: Attribute.Relation<
      'api::production-order-container.production-order-container',
      'manyToOne',
      'api::production-order.production-order'
    >;
    oils: Attribute.Relation<
      'api::production-order-container.production-order-container',
      'oneToMany',
      'api::oil.oil'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::production-order-container.production-order-container',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::production-order-container.production-order-container',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProviderProvider extends Schema.CollectionType {
  collectionName: 'providers';
  info: {
    singularName: 'provider';
    pluralName: 'providers';
    displayName: 'Provider';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    credit: Attribute.Decimal & Attribute.DefaultTo<0>;
    total: Attribute.Decimal & Attribute.DefaultTo<0>;
    tel: Attribute.String;
    cin: Attribute.String;
    matricule: Attribute.String;
    procurements: Attribute.Relation<
      'api::provider.provider',
      'oneToMany',
      'api::procurement.procurement'
    >;
    warehouse: Attribute.Relation<
      'api::provider.provider',
      'manyToOne',
      'api::warehouse.warehouse'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::provider.provider',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::provider.provider',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSaleSale extends Schema.CollectionType {
  collectionName: 'sales';
  info: {
    singularName: 'sale';
    pluralName: 'sales';
    displayName: 'Sale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    customer: Attribute.Relation<
      'api::sale.sale',
      'manyToOne',
      'api::customer.customer'
    >;
    tank: Attribute.Relation<'api::sale.sale', 'manyToOne', 'api::tank.tank'>;
    brut: Attribute.Float;
    type: Attribute.Enumeration<['OIL', 'FITOURA', 'AOULA']>;
    unit_price: Attribute.Float;
    quantite_client: Attribute.Float;
    matricule: Attribute.String;
    invoice: Attribute.Relation<
      'api::sale.sale',
      'manyToOne',
      'api::invoice.invoice'
    >;
    tar: Attribute.Float;
    tva: Attribute.Float;
    address: Attribute.String;
    driver: Attribute.String;
    trailer: Attribute.String;
    truck: Attribute.String;
    notice: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::sale.sale', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::sale.sale', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiSalePayementSalePayement extends Schema.CollectionType {
  collectionName: 'sale_payements';
  info: {
    singularName: 'sale-payement';
    pluralName: 'sale-payements';
    displayName: 'SalePayement';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    customer: Attribute.Relation<
      'api::sale-payement.sale-payement',
      'manyToOne',
      'api::customer.customer'
    >;
    type: Attribute.Enumeration<['CASH', 'CHEQUE', 'TRANSFER', 'EFFECT']>;
    comment: Attribute.String;
    value: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sale-payement.sale-payement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sale-payement.sale-payement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSettingSetting extends Schema.CollectionType {
  collectionName: 'settings';
  info: {
    singularName: 'setting';
    pluralName: 'settings';
    displayName: 'Setting';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    oil_procurement_price: Attribute.Decimal;
    hab_formula: Attribute.JSON;
    dal_default: Attribute.Decimal & Attribute.DefaultTo<10>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::setting.setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::setting.setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTankTank extends Schema.CollectionType {
  collectionName: 'tanks';
  info: {
    singularName: 'tank';
    pluralName: 'tanks';
    displayName: 'Tank';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    oils: Attribute.Relation<'api::tank.tank', 'oneToMany', 'api::oil.oil'>;
    weight: Attribute.Float;
    k_first: Attribute.Float;
    acidity: Attribute.Float;
    out_transport_oils: Attribute.Relation<
      'api::tank.tank',
      'oneToMany',
      'api::transport-oil.transport-oil'
    >;
    in_transport_oils: Attribute.Relation<
      'api::tank.tank',
      'oneToMany',
      'api::transport-oil.transport-oil'
    >;
    warehouse: Attribute.Relation<
      'api::tank.tank',
      'manyToOne',
      'api::warehouse.warehouse'
    >;
    k_second: Attribute.Decimal;
    degustation: Attribute.String;
    bio: Attribute.String;
    sales: Attribute.Relation<'api::tank.tank', 'oneToMany', 'api::sale.sale'>;
    transport_oil_acitivities: Attribute.Relation<
      'api::tank.tank',
      'oneToMany',
      'api::transport-oil-acitivity.transport-oil-acitivity'
    >;
    out_transport_oil_acitivities: Attribute.Relation<
      'api::tank.tank',
      'oneToMany',
      'api::transport-oil-acitivity.transport-oil-acitivity'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::tank.tank', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::tank.tank', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiTimesheetTimesheet extends Schema.CollectionType {
  collectionName: 'timesheets';
  info: {
    singularName: 'timesheet';
    pluralName: 'timesheets';
    displayName: 'Timesheet';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    employee: Attribute.Relation<
      'api::timesheet.timesheet',
      'manyToOne',
      'api::employee.employee'
    >;
    date: Attribute.Date;
    seconds: Attribute.BigInteger;
    comment: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::timesheet.timesheet',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::timesheet.timesheet',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTransportTransport extends Schema.CollectionType {
  collectionName: 'transports';
  info: {
    singularName: 'transport';
    pluralName: 'transports';
    displayName: 'Transport Batch';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    from: Attribute.Relation<
      'api::transport.transport',
      'manyToOne',
      'api::batch.batch'
    >;
    to: Attribute.Relation<
      'api::transport.transport',
      'manyToOne',
      'api::batch.batch'
    >;
    weight: Attribute.Decimal & Attribute.Required;
    vehicule: Attribute.String;
    sender: Attribute.Relation<
      'api::transport.transport',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    receiver: Attribute.Relation<
      'api::transport.transport',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    amount: Attribute.Float;
    matricule: Attribute.String;
    transportation_price: Attribute.Float;
    brut: Attribute.Float;
    tar: Attribute.Float;
    weighing: Attribute.Relation<
      'api::transport.transport',
      'oneToOne',
      'api::weighing.weighing'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::transport.transport',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::transport.transport',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTransportOilTransportOil extends Schema.CollectionType {
  collectionName: 'transport_oils';
  info: {
    singularName: 'transport-oil';
    pluralName: 'transport-oils';
    displayName: 'Transport Oil';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    weight: Attribute.Float;
    receiver: Attribute.Relation<
      'api::transport-oil.transport-oil',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    sender: Attribute.Relation<
      'api::transport-oil.transport-oil',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    to: Attribute.Relation<
      'api::transport-oil.transport-oil',
      'manyToOne',
      'api::tank.tank'
    >;
    from: Attribute.Relation<
      'api::transport-oil.transport-oil',
      'manyToOne',
      'api::tank.tank'
    >;
    matricule: Attribute.String;
    transportation_price: Attribute.Float;
    batch: Attribute.Relation<
      'api::transport-oil.transport-oil',
      'manyToOne',
      'api::batch.batch'
    >;
    order_by: Attribute.Integer;
    transport_oil_acitivity: Attribute.Relation<
      'api::transport-oil.transport-oil',
      'manyToOne',
      'api::transport-oil-acitivity.transport-oil-acitivity'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::transport-oil.transport-oil',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::transport-oil.transport-oil',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTransportOilAcitivityTransportOilAcitivity
  extends Schema.CollectionType {
  collectionName: 'transport_oil_acitivities';
  info: {
    singularName: 'transport-oil-acitivity';
    pluralName: 'transport-oil-acitivities';
    displayName: 'Transport Oil Acitivity';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    weight: Attribute.Float;
    receiver: Attribute.Relation<
      'api::transport-oil-acitivity.transport-oil-acitivity',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    sender: Attribute.Relation<
      'api::transport-oil-acitivity.transport-oil-acitivity',
      'oneToOne',
      'api::warehouse.warehouse'
    >;
    to: Attribute.Relation<
      'api::transport-oil-acitivity.transport-oil-acitivity',
      'manyToOne',
      'api::tank.tank'
    >;
    from: Attribute.Relation<
      'api::transport-oil-acitivity.transport-oil-acitivity',
      'manyToOne',
      'api::tank.tank'
    >;
    matricule: Attribute.String;
    transportation_price: Attribute.Float;
    transport_oils: Attribute.Relation<
      'api::transport-oil-acitivity.transport-oil-acitivity',
      'oneToMany',
      'api::transport-oil.transport-oil'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::transport-oil-acitivity.transport-oil-acitivity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::transport-oil-acitivity.transport-oil-acitivity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWarehouseWarehouse extends Schema.CollectionType {
  collectionName: 'warehouses';
  info: {
    singularName: 'warehouse';
    pluralName: 'warehouses';
    displayName: 'Warehouse';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    batches: Attribute.Relation<
      'api::warehouse.warehouse',
      'oneToMany',
      'api::batch.batch'
    >;
    address: Attribute.Text;
    phone: Attribute.String;
    tanks: Attribute.Relation<
      'api::warehouse.warehouse',
      'oneToMany',
      'api::tank.tank'
    >;
    providers: Attribute.Relation<
      'api::warehouse.warehouse',
      'oneToMany',
      'api::provider.provider'
    >;
    beneficaries: Attribute.Relation<
      'api::warehouse.warehouse',
      'oneToMany',
      'api::beneficary.beneficary'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::warehouse.warehouse',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::warehouse.warehouse',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWeighingWeighing extends Schema.CollectionType {
  collectionName: 'weighings';
  info: {
    singularName: 'weighing';
    pluralName: 'weighings';
    displayName: 'Weighing';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    gross: Attribute.Float & Attribute.Required;
    extruction_rate: Attribute.Float & Attribute.Required;
    unit_price: Attribute.Float & Attribute.Required;
    tare: Attribute.Float & Attribute.Required;
    total_price: Attribute.Float;
    net: Attribute.Float;
    hab: Attribute.Float & Attribute.DefaultTo<0>;
    dal: Attribute.Float & Attribute.DefaultTo<0>;
    batch: Attribute.Relation<
      'api::weighing.weighing',
      'manyToOne',
      'api::batch.batch'
    >;
    procurement: Attribute.Relation<
      'api::weighing.weighing',
      'manyToOne',
      'api::procurement.procurement'
    >;
    tax: Attribute.Float;
    cash_transaction: Attribute.Relation<
      'api::weighing.weighing',
      'oneToOne',
      'api::cash-transaction.cash-transaction'
    >;
    state: Attribute.Enumeration<
      ['ACHAT', 'TRANSFERT', 'PRODUCTION', 'LOST_OLIVE']
    >;
    transport_batch: Attribute.Relation<
      'api::weighing.weighing',
      'oneToOne',
      'api::transport.transport'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::weighing.weighing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::weighing.weighing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::batch.batch': ApiBatchBatch;
      'api::beneficary.beneficary': ApiBeneficaryBeneficary;
      'api::canceled-weighing.canceled-weighing': ApiCanceledWeighingCanceledWeighing;
      'api::cash-transaction.cash-transaction': ApiCashTransactionCashTransaction;
      'api::cash-validation.cash-validation': ApiCashValidationCashValidation;
      'api::container.container': ApiContainerContainer;
      'api::customer.customer': ApiCustomerCustomer;
      'api::customer-payment.customer-payment': ApiCustomerPaymentCustomerPayment;
      'api::default.default': ApiDefaultDefault;
      'api::employee.employee': ApiEmployeeEmployee;
      'api::employee-payment.employee-payment': ApiEmployeePaymentEmployeePayment;
      'api::history.history': ApiHistoryHistory;
      'api::invoice.invoice': ApiInvoiceInvoice;
      'api::machine.machine': ApiMachineMachine;
      'api::oil.oil': ApiOilOil;
      'api::oil-category.oil-category': ApiOilCategoryOilCategory;
      'api::order.order': ApiOrderOrder;
      'api::payment-category.payment-category': ApiPaymentCategoryPaymentCategory;
      'api::pile-bottom.pile-bottom': ApiPileBottomPileBottom;
      'api::procurement.procurement': ApiProcurementProcurement;
      'api::procurement-payment.procurement-payment': ApiProcurementPaymentProcurementPayment;
      'api::production-order.production-order': ApiProductionOrderProductionOrder;
      'api::production-order-container.production-order-container': ApiProductionOrderContainerProductionOrderContainer;
      'api::provider.provider': ApiProviderProvider;
      'api::sale.sale': ApiSaleSale;
      'api::sale-payement.sale-payement': ApiSalePayementSalePayement;
      'api::setting.setting': ApiSettingSetting;
      'api::tank.tank': ApiTankTank;
      'api::timesheet.timesheet': ApiTimesheetTimesheet;
      'api::transport.transport': ApiTransportTransport;
      'api::transport-oil.transport-oil': ApiTransportOilTransportOil;
      'api::transport-oil-acitivity.transport-oil-acitivity': ApiTransportOilAcitivityTransportOilAcitivity;
      'api::warehouse.warehouse': ApiWarehouseWarehouse;
      'api::weighing.weighing': ApiWeighingWeighing;
    }
  }
}
