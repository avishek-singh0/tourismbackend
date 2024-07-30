const Review = require("./../models/reviewmodel");


exports.getAllReview = async(req,res)=>{

    try {
        
    const getreview = await Review.find();
    // .populate({
    //     path: "tour",
    //     select:"name"
    // }).populate({
    //     path:'user',
    //     select:"name photo"
    // })

    res.status(201).json({
        status:"success",
      result: getreview.length,
      data:{
       getreview
       }
    })

    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
          });
        
    }

}


exports.Createreview = async (req,res)=>{

    try {

        const newReview = await Review.create(req.body);
        res.status(201).json({
         message: 'success',
         data: {
             review: newReview
         }})
        // console.log(tour)

    } catch (err) {
        const errorMessage = err.message || 'Unknown error';
        res.status(404).json({
            status: 'fail',
            message: errorMessage
          });
    }
}