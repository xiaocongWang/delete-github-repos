exports.defaults = function(target, ...sourceList) {
    sourceList.forEach((source) => {
        Object
            .keys(source || {})
            .forEach((key) => {
                if (target[key] === undefined) {
                    target[key] = source[key];
                }
            });
    });

    return target;
}

exports.isStream = function(val) {
    return val && (typeof data === 'object' ) && (typeof data.pipe === 'function');
}
