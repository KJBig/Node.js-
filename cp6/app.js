const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('session');
const multer = require('multer');
const fs = require('fs');

app.set('port', process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
    },
}));

app.use('/', (req, res, next) =>{// 정적파일 제공후 next 실행 x
    if(req.session.id)//로그인 했을 시 static => 미들웨어 확장법.
    {
        express.static(path.join(__dirname, 'public'))(req, res, next)
    }else{
        next();
    }
});


/*
app.use((req, res, next) =>{  // 함수가 있는 부분이 미들웨어.
    console.log("모든 요청에 실행하고 싶어요.1");
    next(); // use는 next()를 해야 다음 라우터로 넘어간다.
}, (req, res, next) =>{
    console.log("모든 요청에 실행하고 싶어요.2");
    next();
}, (req, res, next) =>{
    console.log("모든 요청에 실행하고 싶어요.3");
    next();
},(req, res, next) =>{
    try {
       // console.log(dqwdqd);
    }catch (err) {
        next(err);//next(err) -> 바로 err 미들웨어로 감
    }
})
*/

try{
    fs.readdirSync('uploads');
}catch(error){
    console.error('uploads 폴더가 없음 -> 폴더 생성');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, res, done){
            done(null, 'uploads/');
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024}, //5 mb 이하 파일만 업로드 가능
});

app.get('/upload', (req, res) =>{
    res.sendFile(path.join(__dirname, 'multipart.html'));
})
/*싱글 이미지
app.post('/upload', upload.single('image'), (req, res) =>{
    console.log(req.file);
    res.send('ok');
})
 */
/* 이미지가 멀티플일때
app.post('/upload', upload.array('image1'), (req, res) =>{
    console.log(req.files);
    res.send('ok');
})
 */
/*
app.post('/upload', upload.fields([{name: 'image1'}, {name: 'image2'}, {name: 'image2'}]), (req, res) =>{
    console.log(req.files.image1);
    res.send('ok');
})
 */

app.post('/upload', upload.none(), (req, res) =>{
    console.log(req.files.image1);
    res.send('ok');
})


app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req, res) => {
    res.send('heldoo express');
});

//와일드 카드
app.get('/category/Javascript', (req, res) => {
    res.send(`hello Javascript`);
});

//위에서부터 실행되기 때문에 와일드 카드는 제일 밑에.
app.get('/category/:name', (req, res) => {
    res.send(`hello ${req.params.name} wild`);
});

app.get('/about', (req, res) => {
    res.send('hello express');
});

// 모든 요청 즉 else
app.get('*', (req, res) => {
    res.send(`else`);

});

//error
app.use((err, req, res, next) => { // 반드시 4개를 써야한다.
    console.error(err);
    res.send('error!, wait!');
});

app.listen(3000, () => {
    console.log('Start express server');
});