module.exports = {

  CC_INSTANTIATE: 'instantiate',
  CC_UPGRADE: 'upgrade',
  CC_INSTALL: 'install',
  CC_TIMEOUT: 'chaincodeTimeout',
  CC_EVENT_TIMEOUT: 'eventWaitTime',
  AP_EVENT_TIMEOUT: 'anchorPeerEventWaitTime',
  CC_ENDORSEMENT_POLICY: 'ENDORSEMENT_POLICY',
  CC_AFFILIATION_DEPT: 'AFFILIATION_DEPT',
  HF_ADMIN_USER_CONFIG: 'admins',
  HF_ADMIN_USER: 'ADMIN_USER',
  TOKEN_BEARER: 'TOKEN_BEARER',
  APP_SECRET: 'APP_SECRET',
  QUERY_TYPE_INSERT: "insert",
  QUERY_TYPE_UPDATE: "update",
  QUERY_TYPE_QUERY: "query",
  STATUS_SUCCESS: {'status':'Success'},
  SUCCESS:'Success',
  FAILURE:'failure',

  STATUS_ACCEPTED:'Accepted',
  STATUS_REJECTED:'Rejected',
  STATUS_ACTIVE:'Active',
  STATUS_CREATED:'Created',
  STATUS_SHIPPED:'Shipped',
  STATUS_RECALLED:'Recalled',

  ORG_TYPE_OPERATOR:'Operator',
  

  CREATE_PO: 'createPO',
  UPDATE_PO: 'updatePOComments',
  UPDATE_PO_STATUS: 'updatePOStatus',
  GET_PO_HISTORY: 'queryPOHistoryWithoutMetadata',
  GET_PO_BY_NUMBER: 'queryPOByPONumber',
  GET_PO_BY_KEY: 'queryPOsByKey',
  GET_PO_BY_STATUS: 'queryPOsByStatus',
  GET_PO_BY_PRODUCT_ID: 'queryPOsByProductID',
  GET_PO_BY_ORG_ID: 'queryPOByOrgID',
  GET_ALL_POS: 'queryAllPOs',
  GET_PO_BY_REF_PO_ID: 'queryPOByRefPOID',

  CREATE_INVOICE: 'createInvoice',
  UPDATE_INVOICE_COMMENTS: 'updateInvoiceComments',
  GET_INVOICE_BY_ID: 'queryInvoiceByID',
  ACCEPT_INVOICE: 'updateInvoiceStatus',
  REJECT_INVOICE: 'updateInvoiceStatus',
  SHIP_INVOICE: 'updateInvoiceStatus',
  GET_INVOICE_HISTORY: 'queryPOHistoryWithoutMetadata',
  GET_INVOICE_BY_NUMBER: 'queryInvoiceByInvoiceNumber',
  GET_INVOICE_BY_STATUS: 'queryInvoiceByStatus',
  GET_INVOICE_BY_ORG_ID: 'queryInvoiceByOrgID',
  GET_INVOICE_BY_PO_ID: 'queryInvoiceByPOID',
  GET_INVOICE_BY_PO_NUMBER: 'queryInvoiceByPONumber',
  RECALL_INVOICE: 'recallInvoice',

  CREATE_PRODUCT: 'createProduct',
  ADD_PRODUCT_STOCK: 'addProductStock',
  GET_PRODUCT_BY_ID: 'queryProductByID',
  GET_ALL_PRODUCTS: 'queryAllProducts',
  GET_PRODUCT_BY_ORGID: 'queryProductByOrgID',
  GET_PO_QUANTITY_DETAILS: 'queryPOQuantityDetails',

  CREATE_ORG: "createOrg",
  CREATE_PO: "createPO",

  CREATE_USER: "createUser",
  CHANGE_PASSWORD: "changeUserPassword",
  RESET_PASSWORD: "resetUserPassword",

  APPROVE:  'approve',
  GET_APPROVED_ORGS:  'queryApprovedOrgs',
  GET_APPROVED_ORGS_BY_ROLE:  'queryApprovedOrgsByRole',

  GET_NOTIFICATION_BY_ORG_ID: 'queryNotificationByOrgID',
  GET_NOTIFICATION_BY_ID: 'queryNotificationByID',


  ORGANIZATION_CHAINCODE_NAME:"org",
  USER_CHAINCODE_NAME:"user",
  PO_CHAINCODE_NAME:"po",

  SC_TRANS_ID_FIELD: '_transaction_id',
  APP_NETWORK_CONFIG: 'config/network-config.yaml',

  SERVICE_DB_CONN_ERROR_MESSAGE: 'Service Database Connection Error',
  OFFCHAIN_DB_CONN_ERROR_MESSAGE: 'Offchain Database Connection Error',

  USER_ONBOARD_SUBJECT: 'Smartbolt Application Registration',

  PASSWORD_RESET_SUBJECT : "Password reset notification from Smartbolt Solution",
  PASSWORD_RESET_TEXT : "Your password is reset to ",
  PASSWORD_CHANGE_SUBJECT: "Password change notification from Smartbolt Solution",
  PASSWORD_CHANGE_TEXT: "Your password is changed. Please contact administrator if you didn't change it.",
  ALREADY_EXISTS : "Already Exist ",

  UNAUTHORIZED_STATUS:401,
  ORG_FETCH_UNAUTHORIZED:"Not Authorized to fetch organization Details",
  SUPERADMIN:"SUPERADMIN"

};
