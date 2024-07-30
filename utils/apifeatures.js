
class APIFeatures {
    constructor(query,queryString){
        this.query=query;
        this.queryString = queryString;
    }

filter() {
 // Build the Query
        //1) Filtering 
        const queryObj = {...this.queryString};     //req through postman  and creating shallow copy
        const excludedFields = ['page','sort','limit','fields'];
        console.log(queryObj);   
        excludedFields.forEach((el) => delete queryObj[el]);
        
        // console.log(queryObj,req.query);  { duration: '5' } { duration: '5', page: '10', sort: '1', limit: '4', fields: '3' }

       // 2)  Advanced Filtering

       let queryStr = JSON.stringify(queryObj);
       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    //    console.log(JSON.parse(queryStr));

        this.query = this.query.find(JSON.parse(queryStr))


    //    let query =  Tour.find(JSON.parse(queryStr));

return this;
}

sort(){
     //Sorting
     if(this.queryString.sort){
        const sortby  = this.queryString.sort.split(',').join(' ');
        // console.log(sortby)
        this.query = this.query.sort(sortby);
        //sort('price ratingAvg)
       }else{
        this.query = this.query.sort('-createdAt')
       }

return this;
}

limitfield(){
     //Field limiting
     if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields)
      }else{
        this.query = this.query.select('-__v')
       }
return this;
}
pagetion(){
  //Pagination
  const page = this.queryString.page*1 || 1;
  const limit = this.queryString.limit*1 || 100;
  const skip = (page-1)*limit;
       //page=2&limit=10          
  this.query = this.query.skip(skip).limit(limit);
  return this;

//   if(this.queryString.page){
//         const numTours = await Tour.countDocuments();   
//   if(skip >= numTours) throw new Error('This page does not exits')
// }  
  
}
}

module.exports = APIFeatures;