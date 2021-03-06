/**
 * 商品model，使用ES6书写方式仅是为了练习而已，
 * 个人推荐user model （user.js ）的写法方式
 */
'use strict'

const mongoose = require('mongoose');
const laoUtils = require('lao-utils');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
 
const GoodSchema = new Schema({
    userId: { type: ObjectId }, //用户ID
    goodId: { type: String }, //商品ID
    name: { type: String },
    oldPrice: { type: Number, default: 0 }, //原价格
    marketPrice: { type: Number, default: 0 }, //最新价格
    priceText:{type:String},//加单位的价格
    image: { type: String }, //图片url
    screenshot:[{type:String}],//截屏
    description: { type: String },
    url: { type: String }, //商品链接
    type: { type: String }, //商品分类
    onSale: { type: Boolean, default: true }, //下架则为false
    floatedData:[{type:Schema.Types.Mixed}],//浮动价格（每次价格变动后，都存储格式为[[时间,价格]]）
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

//index
GoodSchema.index({ goodId: 1 });
GoodSchema.index({ type: 1 });

const GoodModel = mongoose.model('Good', GoodSchema);
/**
 * add
 */
function add(info) {
    return new Promise((resolve, reject) => {
        GoodModel.findOne({userId:info.userId,goodId: info.goodId, type: info.type }).exec().then((good) => {
            if (good) {
                reject({
                    result_code:-1,
                    status: 402,
                    error: '该商品已经存在！'
                });
            } else {
                //初始价格监测值
                let pd=[[new Date(),info.price]];
                GoodModel.create({
                        userId: info.userId,
                        goodId: info.goodId,
                        name: info.name,
                        oldPrice: info.price,
                        marketPrice: info.price,
                        priceText: info.priceText,
                        image: info.image,
                        description: info.description,
                        url: info.url,
                        floatedData: pd,
                        type: info.type
                    })
                    .then(good => {
                        resolve(good);
                     })
                    .catch(err => {
                        reject(err);
                    });
            }
        }).catch(err => reject(err));
    });
}
/**
 * update
 */
function update(id, info){
  return new Promise((resolve, reject) => {
    GoodModel.update(info, {
      where: {
        id: id
      }
    })
    .then(good => resolve(good))
    .catch(err => reject(err));
  });
}
/**
 * query
 */
function list(query, opt) {
    return new Promise((resolve, reject) => {
        GoodModel.find(query, '', opt).then(goods => {
            resolve(goods);
        }).catch(err => { reject(err) });
    });
}
function getGoodById(goodId,opt){
    return new Promise((resolve,reject)=>{
        GoodModel.findOne({_id:goodId})
        .then(good=>{
            resolve(good);
        })
        .catch(err=>{
            reject(err);
        });
    });
    
}
/**
 * del
 */
function del(goodId){
    return new Promise((resolve,reject)=>{
        GoodModel.remove({_id:goodId}).then(good=>{
            resolve(good);
        }).catch(err=>{
            reject(err);
        });
    });
}
/**
 * count
 */
function count(query){
    return new Promise((resolve,reject)=>{
        GoodModel.count(query).then(count=>{
            resolve(count);
        }).catch(err=>{
            reject(err);
        });
    });
}

module.exports = { add,update,list,getGoodById,del,count};
