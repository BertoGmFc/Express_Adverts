"use strict";

const express = require('express');
const router = express.Router();
const AdvertController = require('../../controller/advertController');
const { body, validationResult } = require('express-validator/check')
const { VALIDATION_FAILED } = require('../../models/customErrors');

/**
 * This module is in charge of communicate with Advert database in mongodb
 * @module User_router
 */


 /**
 * Method that signs in the user
 * <p>curl --header "Authorization: 123" http://localhost:8080/api/adverts</p>
 * @name GetAdvert
 * @route {get} /api/adverts
 * @authentication This route uses JWT verification. If you don't have the JWT you need to sign in with a valid user
 * @queryparam {Number} limit Maximun number of registers
 * @queryparam {Number} skip How many entries must be skipped on the request
 * @queryparam {String} sort Attribute which will be used to sort the entries
 * @queryparam {String} id Id of ad
 * @queryparam {String} tags List tag to be filtered. If you want to add more than one tag, you should separate them by commas
 * @queryparam {Boolean} sold Filter if items are sold or not
 * @queryparam {String} name Filter by name
 * @queryparam {String | Number} price Price to be filtered
 */
router.get('/', (req, res, next) => {
    var limit = parseInt(req.query.limit) || null;
    var skip = parseInt(req.query.skip) || null;
    var sort = req.query.sort || null;
    var id = req.query.id || null;
    var tags = req.query.tags || null;
    var sold = req.query.sold || null;
    var name = req.query.name || null;
    var price = req.query.price || null;

    var promise = AdvertController.get_adverts(id, tags, sold, name, price,  sort, limit, skip);
    promise.then((result) => {
        res.status(200).json({
            adverts: result
        });
    }, (err) => {
        next(err);
    });
});

/**
* POST Creates a new advert
* curl -d '{      
            "nombre": "triciclo",      
            "venta": true,      
            "precio": 20,15,      
            "foto": "http://127.0.0.1:8080/images/anuncios/bici.jpg",      
            "tags": [ "lifestyle", "motor"]    
        }' -H "Content-Type: application/json" -X POST http://localhost:8080/api/adverts/create
*/

/**
 * Creates a new advert
 * <p>curl -d '{      
            "nombre": "triciclo",      
            "venta": true,      
            "precio": 20,15,      
            "foto": "http://127.0.0.1:8080/images/anuncios/bici.jpg",      
            "tags": [ "lifestyle", "motor"]    
        }' -H "Content-Type: application/json" -X POST http://localhost:8080/api/adverts/create</p>
 * @name CreateAdvert
 * @route {get} /api/adverts/create
 * @authentication This route uses JWT verification. If you don't have the JWT you need to sign in with a valid user
 * @bodyparam {Arrat.String} tags List tag to be assigned to the item.
 * @bodyparam {Boolean} sold If item is sold or not
 * @bodyparam {String} name Name of the item
 * @bodyparam {Number} price Price of the item
 * @bodyparam {String} photo URL of the associated image
 */
router.post('/create', [
    body('name').not().isEmpty().withMessage("nombre must not be empty"),
    body('price').isNumeric().withMessage("precio must be numeric"),
    body('sold').isBoolean().withMessage("sold must be boolean"),
    body('photo').isURL().withMessage("foto must be an url"),
    body('tags').isArray().withMessage("tags must be an array")
], (req, res, next) => {
    console.info(req.body);
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(VALIDATION_FAILED( errors.array()[0].msg ))
    }
    var promise = AdvertController.insert_advert(req.body.name, 
                                                 req.body.price, 
                                                 req.body.sold, 
                                                 req.body.photo, 
                                                 req.body.tags);
    promise.then((result) => {
        res.status(200).send('ok');
    }, (err) => {
        next(err);
    });
});

/**
 * curl --header "Authorization: 123" http://localhost:8080/api/adverts/tags
 */
router.get('/tags', (req, res, next) => {
    var promise = AdvertController.get_tags();
    promise.then((result) => {
        res.status(200).json({
            tags: result
        });
    }, (err) => {
        next(err);
    });
});

module.exports = router;
