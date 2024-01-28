# Lobaro Platform Parser for wmbus Gateway

This parser may be used for

- Lobaro GW V2
- Lobaro GW V3
- Lobaro GW Dinrail

# Changelog
## 0.0.3 - 2024-01-28
* Add header to js file
* For EMM and ESM error code parsing threat 255 as 0 as not set.

## 0.0.2 - 2024-01-24
Add handling of uplink types 'wmbus' and 'sync-config'.

## 0.0.1 - 2024-01-23
Initial commit taken from public Lobaro Platform instance and device type `wMBUS Gateway`.
### Added

- EMM and ESM to human readable string conversion function.
