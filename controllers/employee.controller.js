const express = require('express');
const router = express.Router();
const { generateCrudMethods } = require('../services');
const { validateDbId, raiseRecord404Error } = require('../middlewares');
const { Employee, EmployeeDetails } = require('../modles/employee.modles');
const db = require('../db');
const employeeCrud = generateCrudMethods(Employee);
const jwt = require('jsonwebtoken');
require('dotenv').config();
// app.use(express.json());
const secretKey = process.env.secretKey;

router.post('/generateTokenn', (req, res, next) => {
    // res.json("jjii");
    // You can customize the payload according to your requirements
    // const payload = {
    //     username: 'user123',
    //     email: 'user@example.com',
    // };

    jwt.sign(req.body, secretKey, {
        algorithm: "HS256",
        expiresIn: 60,
    }, (err, token) => {
        if (err) {
            res.status(500).json({ error: 'Failed to generate token' });
        } else {
            console.log("t", token)
            res.json({ token });
        }
    });
});
router.get('/', (req, res, next) => {
    var dataIs;
    employeeCrud.getAll().then((data) => {

        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            const user = jwt.verify(token.trim(), process.env.secretKey);
            if (user && user.exp) {
                return res.send(data);
            } else {
                return res.status(401).json({ "error": "Not Authorized" });
            }
        } catch (error) {
            return res.status(401).json({ "error": "Not Authorized" });

        }


    }).catch((error) => {
        next(error)
    })

});
router.get('/address/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const pipeline = [
            {
                $match: {
                    userId: Math.abs(userId), // Match the userId field
                },
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'employeeData',
                },
            },
            {
                $unwind: '$employeeData',
            },
            {
                $project: {
                    name: '$employeeData.fullName',
                    email: '$employeeData.email',
                    address: [{
                        city: '$city',
                        address: '$address',
                        distric: '$distric',
                    }],
                },
            },
        ];

        const result = await EmployeeDetails.aggregate(pipeline);


        // res.json(result);
        console.log("resujhu", result)
        res.send(result);
    } catch (error) {
        console.log("ddd", error)
        res.status(404).json({ error: 'An error occurredhhhjh' });
        next();
    }
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

router.delete('/:id', validateDbId, (req, res) => {
    console.log("start")
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        const user = jwt.verify(token, process.env.secretKey);
        console.log("eeeeeeeeeeeeeeeeeeeee", !user)
        if (user && user.exp) {
            employeeCrud.delete(req.params.id).then((data) => {


                if (data) {
                    res.send(data);

                } else {
                    raiseRecord404Error(req, res);
                }


            }).catch((error) => {
                console.log(error);
                next(error)
            })
        } else {
            return res.status(401).json({ error: "invalid token" });

        }

    } catch (error) {
        return res.status(401).json({ error: "Not Authorized" });

    }



});



module.exports = router;