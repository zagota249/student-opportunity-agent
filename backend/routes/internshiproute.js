const express=require('express');
const Router=express.Router();
const {protect}=require('../middleware/authmiddleware');
const {applyinternship,getinternship,getinternshipbyid,updateinternship,deleteinternship}=require('../controllers/internshipcontroller');

router.route('/').post(protect,applyinternship).get(protect,getinternship);
router.route('/:id').get(protect,getinternshipbyid).put(protect,updateinternship).delete(protect,deleteinternship);


module.exports=Router;
