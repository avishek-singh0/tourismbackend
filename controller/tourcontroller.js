const Tour = require('./../models/tourmodel');
const APIFeatures = require('./../utils/apifeatures');



exports.aliasTopTours =  (req,res,next) =>{
   req.query.limit='5';
   req.query.sort = '-ratingsAverage,price';
   req.query.fields='name,price,ratingsAverage,summary,difficulty';
   next();

};



// exports.getAllTours = async (req, res) => {
//     try {

//        // Execute the query
//        const features = new APIFeatures(Tour.find(),req.query)
//        .filter()
//        .sort()
//        .limitfield()
//        .pagetion();

//        const tours = await features.query;


//       //Send response
//       res.status(200).json({
//         status: 'success',
//         results: tours.length, 
//         data: tours
//       });
//     } catch (err) { 
//       res.status(404).json({
//         status: 'fail',
//         message: err
//       });
//     }
//   };
  
// exports.getAllTours = async (req, res) => {
//     try {
//       // EXECUTE QUERY
//       const features = new APIFeatures(Tour.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//       const tours = await features.query;
  
//       // SEND RESPONSE
//       res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//           tours
//         }
//       });
//     } catch (err) {
//       res.status(404).json({
//         status: 'fail',
//         message: err
//       });
//     }
//   };
  
  exports.getAllTours = async (req,res)=>{
    try { 


        //execute query
        const features = new APIFeatures(Tour.find(),req.query)
        .filter().sort().limitfield().pagetion()
        const tours= await features.query;

        const result =  tours.length

        res.status(200).json({
           
           result,
            data:{
                tours
            },
            status:'succcess'
        })
        
    } catch (error) {
        res.status(404).json({
                    status: 'fail',
                    message: error
                  });
    }
  }



exports.createTour = async(req,res) =>{
    try {
       const newTour = await Tour.create(req.body);
       res.status(201).json({
        message: 'success',
        data: {
            tour: newTour
        }
    })
        
    } catch (err) { 
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}


exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id).populate({
            path:"guides",
            select:"-__v -password"
        })
    //   console.log(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                tours: tour
            }
        })
    }
    catch {
        res.status(404).json({
            status: 'fail'
        })

    }

}


exports.updateTour = async (req, res) => {


    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })


        res.status(200).json({
            status: 'success',
            // results: tours.length,
            data: {
                tour
            }
        })

    }
    catch {


    }
   

}



exports.deletetour = async (req, res) => {

    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',

            data: null
        })
    }
    catch {
        res.status(404).json({
            status: 'fail'
        })

    }

}

exports.getTourStats = async(req,res)=>{
    try {
        const stats = await Tour.aggregate([
            {
                $match:{ratingAverage:{$gte:4.5} }
            },
            {
                $group:{
                    _id:null,
                    avgRating:{$avg:'$ratingAverage'},
                    avgPrice: {$avg:'$price'},
                    minPrice:{$min:'$price'},
                    maxPrice:{$max:'$price'}
                }
            },
            {
                $sort:{avgPrice:1}  //1for ascending
            }
        ]);
        res.status(200).json({
            status:'success',
            data:{
                stats
            }
        })
    } catch (err) {

         res.status(401).json({
            message:err,
            status:'fail'
         })
}
}

exports.getMonthlyPlan =  async (req,res)=>{
    try {
        const year = req.params.year * 1;   //2021
               

        console.log('Requested Year:', year);
        
        const plan = await Tour.aggregate( [
            { 
                $unwind : '$startDates'   //no longer arr now first ele of arr 
            },{
                $match:{
                    startDates:{
                        $gte: new Date(`${year}:01:01`),
                        $lte: new Date(`${year}:12:31`),
                    }
                }
            }
        ]);

        res.status(200).json({
            status:'success',
            tour: plan.length,
            data:{
               plan
            }
        })
        
    } catch (error) {
        res.status(401).json({
            message:error,
            status:'fail'
         })
    }
}

