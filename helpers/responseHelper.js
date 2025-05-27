exports.success = (res, data) => {
    res.status(200).json(data);
};

exports.error = (res, message, err = null) => {
    console.error(err);
    res.status(500).json({ message });
};
