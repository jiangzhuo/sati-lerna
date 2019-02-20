const fs = require('fs');
const path = require('path');
const {Source, buildSchema} = require('graphql');

let indexJsExportAll = '';
let depthLimit = 100;

/**
 * Generate the query for the specified field
 * @param curName name of the current field
 * @param curParentType parent type of the current field
 * @param curParentName parent name of the current field
 * @param argumentList list of arguments from all fields
 * @param crossReferenceKeyList list of the cross reference
 * @param curDepth currentl depth of field
 */
const generateQuery = (
    gqlSchema,
    curName,
    curParentType,
    curParentName,
    argumentList = [],
    crossReferenceKeyList = [], // [`${curParentName}To${curName}Key`]
    curDepth = 1,
) => {
    const field = gqlSchema.getType(curParentType).getFields()[curName];
    const curTypeName = field.type.inspect().replace(/[[\]!]/g, '');
    const curType = gqlSchema.getType(curTypeName);
    let queryStr = '';
    let childQuery = '';

    if (curType.getFields) {
        const crossReferenceKey = `${curParentName}To${curName}Key`;
        if (crossReferenceKeyList.indexOf(crossReferenceKey) !== -1 || curDepth > depthLimit) return '';
        crossReferenceKeyList.push(crossReferenceKey);
        const childKeys = Object.keys(curType.getFields());
        childQuery = childKeys
            .map(cur => generateQuery(
                gqlSchema, cur, curType, curName, argumentList, crossReferenceKeyList, curDepth + 1,
            ).queryStr)
            .filter(cur => cur)
            .join('\n');
    }

    if (!(curType.getFields && !childQuery)) {
        queryStr = `${'    '.repeat(curDepth)}${field.name}`;
        if (field.args.length > 0) {
            argumentList.push(...field.args);
            const argsStr = field.args.map(arg => `${arg.name}: $${arg.name}`).join(', ');
            queryStr += `(${argsStr})`;
        }
        if (childQuery) {
            queryStr += `{\n${childQuery}\n${'    '.repeat(curDepth)}}`;
        }
    }

    /* Union types */
    if (curType.astNode && curType.astNode.kind === 'UnionTypeDefinition') {
        const types = curType.getTypes();
        if (types && types.length) {
            const indent = `${'    '.repeat(curDepth)}`;
            const fragIndent = `${'    '.repeat(curDepth + 1)}`;
            queryStr += '{\n';

            for (let i = 0, len = types.length; i < len; i++) {
                const valueTypeName = types[i];
                const valueType = gqlSchema.getType(valueTypeName);
                const unionChildQuery = Object.keys(valueType.getFields())
                    .map(cur => generateQuery(
                        gqlSchema, cur, valueType, curName, argumentList, crossReferenceKeyList, curDepth + 2,
                    ).queryStr)
                    .filter(cur => cur)
                    .join('\n');
                queryStr += `${fragIndent}... on ${valueTypeName} {\n${unionChildQuery}\n${fragIndent}}\n`;
            }
            queryStr += `${indent}}`;
        }
    }
    return {queryStr, argumentList};
};

/**
 * Generate the query for the specified field
 * @param obj one of the root objects(Query, Mutation, Subscription)
 * @param description description of the current object
 */
const generateFile = (gqlSchema, description, writeFolder) => {
    let indexJs = '';
    let getTypeMethod;
    switch (description) {
        case 'Mutation':
            getTypeMethod = 'getMutationType';
            break;
        case 'Query':
            getTypeMethod = 'getQueryType';
            break;
        case 'Subscription':
            getTypeMethod = 'getSubscriptionType';
            break;
        default:
            console.log('[gqlg warning]:', 'description is required');
    }
    Object.keys(gqlSchema[getTypeMethod]().getFields()).forEach((type) => {
        const queryResult = generateQuery(gqlSchema, type, description);
        let query = queryResult.queryStr;
        const field = gqlSchema.getType(description).getFields()[type];
        const args = field.args.concat(queryResult.argumentList);
        const argStr = args
            .filter((item, pos) => args.indexOf(item) === pos)
            .map(arg => `$${arg.name}: ${arg.type}`)
            .join(', ');
        query = `${description.toLowerCase()} ${type}${argStr ? `(${argStr})` : ''}{\n${query}\n}`;
        fs.writeFileSync(path.join(writeFolder, `./${type}.gql`), query);
        indexJs += `module.exports.${type} = fs.readFileSync(path.join(__dirname, '${type}.gql'), 'utf8');\n`;
    });
    return indexJs;
};



let outputPath = path.join(__dirname, './gql');
const glob = require("glob");
// options is optional
let files = glob.sync("**/src/**/*.graphqls");
let queryIndexJs = 'const fs = require(\'fs\');\nconst path = require(\'path\');\n\n';
let mutationIndexJs = 'const fs = require(\'fs\');\nconst path = require(\'path\');\n\n';
// files.forEach((file) => {
//     // genAll(path.join(process.cwd(), file), outputPath);
//
//     let schemaFilePath = path.join(process.cwd(), file);
//     const typeDef = fs.readFileSync(schemaFilePath);
//     const source = new Source(typeDef.toString());
//     const gqlSchema = buildSchema(source);
//
//     if (gqlSchema.getMutationType()) {
//         generateFile(gqlSchema, 'Query', outputPath);
//     }
// });
// fs.writeFileSync(path.join(path.join(outputPath, 'queries'), 'index.js'), indexJs);
// indexJsExportAll += `module.exports.queries = require('./queries');\n`;

const queryWriteFolder = path.join(outputPath, 'queries');
const mutationWriteFolder = path.join(outputPath, 'mutations');
fs.mkdirSync(queryWriteFolder, {recursive: true});
fs.mkdirSync(mutationWriteFolder, {recursive: true});

indexJs = 'const fs = require(\'fs\');\nconst path = require(\'path\');\n\n';
files.forEach((file) => {
    // genAll(path.join(process.cwd(), file), outputPath);

    console.log(file)
    let schemaFilePath = path.join(process.cwd(), file);
    const typeDef = fs.readFileSync(schemaFilePath);
    const source = new Source(typeDef.toString());
    const gqlSchema = buildSchema(source);

    if (gqlSchema.getQueryType()) {
        queryIndexJs += generateFile(gqlSchema, 'Query', queryWriteFolder);
    }
    if (gqlSchema.getMutationType()) {
        mutationIndexJs += generateFile(gqlSchema, 'Mutation', mutationWriteFolder);
    }
});
fs.writeFileSync(path.join(queryWriteFolder, 'index.js'), queryIndexJs);
fs.writeFileSync(path.join(mutationWriteFolder, 'index.js'), mutationIndexJs);
indexJsExportAll += `module.exports.queries = require('./queries');\n`;
indexJsExportAll += `module.exports.mutations = require('./mutations');\n`;

fs.writeFileSync(path.join(outputPath, 'index.js'), indexJsExportAll);


