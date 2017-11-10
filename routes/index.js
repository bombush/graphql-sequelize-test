const route= (model) => (req, res) => {

    model.Users.findAll({
        attributes: ['name'],
        limit: 10,
        raw: true
    })
    .then( result => console.log(result));
    res.send('Hello world');
}

export default route;
