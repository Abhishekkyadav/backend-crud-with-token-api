const express = require('express');
const router = express.Router();
const { generateCrudMethods } = require('../services');
const { validateDbId, raiseRecord404Error } = require('../middlewares');
const { EmployeeDetails } = require('../modles/employee.modles');

const employeeCrud = generateCrudMethods(EmployeeDetails);

router.get('/', (req, res, next) => {
    employeeCrud.getAll().then((data) => {
        res.send(data);
    }).catch((error) => {
        next(error)
    })
});


router.get('/:id', validateDbId, (req, res, next) => {


    employeeCrud.getById(req.params.id).then((data) => {
        if (data) {
            res.send(data);

        } else {
            raiseRecord404Error(req, res);
        }
    }).catch((error) => {
        next(error)
    })
});
router.post('/', (req, res, next) => {
    employeeCrud.create(req.body).then(data => res.status(201).json("success data add")).catch(error => next(error))
});

router.put('/:id', validateDbId, (req, res) => {
    employeeCrud.update(req.params.id, req.body).then((data) => {
        if (data) {
            res.send(data);

        } else {
            raiseRecord404Error(req, res);
        }
    }).catch((error) => {
        next(error)
    })
});

router.delete('/:id', validateDbId, () => {
    // db.myColl.deleteOne(
    //     { category: "cafe", status: "A" },
    //     { collation: { locale: "fr", strength: 1 } }
    //  )
    employeeCrud.delete(req.params.id).then((data) => {
        if (data) {
            res.send(data);

        } else {
            raiseRecord404Error(req, res);
        }
    }).catch((error) => {
        next(error)
    })

});



module.exports = router;