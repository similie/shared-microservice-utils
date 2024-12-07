/**
 * @summary Attributes object for a Station model
 */
export const StationAttributes = {
  station_id: {
    type: "string",
  },
  serial_number: {
    type: "string",
    unique: true,
  },
  local_name: {
    type: "string",
  },
  registration_id: {
    type: "string",
  },
  code: {
    type: "string",
  },
  geo: {
    type: "geometry",
  },
  station_state: {
    model: "variable",
  },
  station_type: {
    model: "stationschema",
    required: true,
  },
  district: {
    model: "district",
  },
  tags: {
    collection: "tag",
  },
  files: {
    collection: "sysfile",
  },
  parents: {
    type: "array",
  },
  archived: {
    type: "boolean",
    defaultsTo: false,
  },
  schema: {
    type: "json",
  },
  alerts: {
    type: "json",
  },
  domain: {
    model: "domain",
  },
  settings: {
    type: "json",
  },
  word_address: {
    type: "json",
  },
  address: {
    type: "json",
  },
  meta: {
    type: "json",
  },
  scannable_id: {
    unique: true,
    type: "string",
  },
  organizational: {
    type: "boolean",
    defaultsTo: false,
  },
  members_only: {
    type: "boolean",
    defaultsTo: false,
  },
  has_facilities: {
    type: "boolean",
    defaultsTo: false,
  },
  state_key: {
    model: "statekeys",
  },
};
/**
 * @summary Sample data for 'keys' inspector functions
 */
export const KeyInspector = {
  _array: [
    { id: "a" },
    {
      id: "b",
      elements: {
        col1: [{ id: "c" }],
        col2: [],
      },
    },
    {
      id: "d",
      elements: {
        col1: [{ id: "e" }, { onions: "f" }],
        col2: [],
        col3: [{ id: "g" }],
      },
    },
  ],
  _object: {
    id: "h",
    domain: true,
    elements: {
      col1: [{ turnips: "t" }],
      col2: [],
    },
    stuff: "more stuff",
  },
  model_attributes: {
    Variable: {
      /** @summary Copy from /api/models/Variable.js */
      _attributes: {
        key: { type: "string" },
        value: { type: "json" },
        order: { type: "integer", min: 0 },
        identity: { type: "string" },
        locked: { type: "boolean", defaultsTo: false },
        domain: { model: "domain" },
        meta: { type: "json" },
      },
    },
    Domain: {
      /** @summary Copy from /api/models/Domain.js */
      _attributes: {
        name: { unique: true, required: true, type: "string" },
        urls: { type: "array" },
        site: { model: "site" },
        avatar: { type: "json" },
        color: { type: "string" },
        node_schema: { type: "string" },
        tags: { collection: "tag" },
        state_key: { model: "statekeys" },
        meta: { type: "json" },
      },
    },
  },
};
