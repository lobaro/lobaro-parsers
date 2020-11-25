# Lobaro Parser Collection
Collection of data decoders to be used for messages uploaded by devices by Lobaro GmbH.

For latest documentation please see: [Lobaro Documentation Page](https://doc.lobaro.com)

# Libraries
Certain functions are reused in many parsers. We develop those the `lib` sub folder, so we can 
keep track of them and test them. However there is no module system in place to be used in 
LoRaWAN Network Servers. We therefore copy the code into each parser that uses it, 
so that each parser works as a single file for ease of deployment.

Bugfixes must be ported into the individual parsers by hand for now. We might include a build system 
in future, that replaces that manual work, but there is no termination for that.

# Testing
Some of our library functions are used extensively in many of our parsers (e.g. parsing of numbers from 
byte arrays). To reduce errors we have unit tests for those libraries.

## package.json
The package.json file exists, so that unit tests can be executed easily in CLion.

