import { world } from "@minecraft/server";

/**
 * save the property
 * @param {string} PropertyName 
 * @param {any[]} jsons 
 */
export function save(PropertyName, jsons) {
    const DyPropNames = getDyPropNames(PropertyName);

    for (let i = 0; i < DyPropNames.length; i++) {
        const DyPropName = DyPropNames[i];
        const json = jsons[i];

        world.setDynamicProperty(DyPropName, JSON.stringify(json));
    }
}

/**
 * add the value in property
 * @param {string} PropertyName 
 * @param {string} value 
 */
export function add(PropertyName, value) {
    const DyPropName = getDyPropName(PropertyName);
    const json = JSON.parse(world.getDynamicProperty(DyPropName));

    json.push(value);

    world.setDynamicProperty(DyPropName, JSON.stringify(json));
}

/**
 * return the jsons
 * @param {string} PropertyName 
 * @returns {any[]} jsons
 */
export function get(PropertyName) {
    const DyPropNames = getDyPropNames(PropertyName);
    let jsons = [];

    for (const DyPropName of DyPropNames) {
        const json = JSON.parse(world.getDynamicProperty(DyPropName));
        jsons.push(json);
    }

    return jsons;
}

/**
 * return the boolean
 * @param {string} PropertyName 
 * @param {string} value 
 * @returns {boolean} boolean
 */
export function hasValue(PropertyName, value) {
    const jsons = get(PropertyName);
    let test = false;

    for (const json of jsons) {
        if (json === value) {
            test = true;
        }
    }

    return test;
}

/**
 * remove the value
 * @param {string} PropertyName 
 * @param {string} value 
 * @returns {boolean} boolean
 */
export function remove(PropertyName, value) {
    const jsons = get(PropertyName);
    let count = 0;
    let test = false;

    jsons: for (const json of jsons) {
        for (let i = 0; i < json.length; i++) {
            if (json[i] === value) {
                json.splice(i, 1);
                test = true;
                break jsons;
            }
        }
        count++;
    }

    save("whitelist", jsons);

    return test;
}

/**
 * return the DyPropName
 * @param {string} PropertyName 
 * @returns {string} DyPropName
 */
function getDyPropName(PropertyName) {
    let i = 0;
    let DyPropName;

    while (true) {
        DyPropName = `${PropertyName}_${i}`;
        if (!world.getDynamicProperty(DyPropName)) {
            world.setDynamicProperty(DyPropName, JSON.stringify([]));
            break;
        }
        i++;
    }

    return DyPropName;
}

/**
 * return the DyPropNames
 * @param {string} PropertyName 
 * @returns {string[]} DyPropNames
 */
function getDyPropNames(PropertyName) {
    let i = 0;
    let DyPropNames = [];

    while (true) {
        const DyPropName = `${PropertyName}_${i}`;
        if (!world.getDynamicProperty(DyPropName)) break;
        if (world.getDynamicProperty(DyPropName)) {
            DyPropNames.push(DyPropName);
        }
        i++;
    }

    return DyPropNames;
}