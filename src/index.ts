import express, { Express, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { engine } from 'express-handlebars'
import multer from 'multer'
import fs from 'fs'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { getFiles } from './folder'
import { getUniqueValues } from './helpers/getUniqueValues'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

const publicDir = path.join(__dirname, '..', 'public')
const filesDir = path.join(publicDir, 'files')

if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true })
}

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, filesDir)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const upload = multer({ storage: storageConfig })

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json()); // Использование body-parser для обработки JSON данных
app.use(bodyParser.urlencoded({ extended: true })); // Использование body-parser для обработки данных формы

if (!process.env.COOKIE_SECRET || !process.env.SESSION_SECRET) {
    throw new Error('COOKIE_SECRET and SESSION_SECRET must be defined in the environment variables');
}

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// Настройка express-handlebars
app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

// Настройка промежуточного ПО для статических файлов
app.use(express.static(publicDir))

app.get('/', (req: Request, res: Response) => {
    res.render('home', {
        title: 'Home',
        uniqueValues: getUniqueValues([1, 2, 3, 2, 1, 4, 3]),
    })
})

app.get('/filestorage', (req: Request, res: Response) => {
    const files = getFiles(filesDir)
    res.render('filestorage', {
        title: 'File storage',
        description: 'List of stored files',
        files,
    })
})

app.get('/upload', (req: Request, res: Response) => {
    res.render('upload', {
        title: 'Upload files',
    })
})

app.post(
    '/upload',
    upload.single('filedata'),
    (req: Request, res: Response, next: NextFunction) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        const filedata = req.file
        if (!filedata) {
            res.send('Error file upload')
        } else {
            res.render('upload', {
                title: 'Upload files',
            })
        }
    },
)

app.get('/set-cookies', (req: Request, res: Response) => {
    res.cookie('monster', 'ням-ням');
    res.cookie('signed_monster', 'ням-ням', { signed: true });
    res.send('Cookies are set');
});

app.get('/get-cookies', (req: Request, res: Response) => {
    const monster = req.cookies.monster;
    const signedMonster = req.signedCookies.signed_monster;
    res.send(`Monster: ${monster}, Signed Monster: ${signedMonster}`);
});

app.get('/clear-cookies', (req: Request, res: Response) => {
    res.clearCookie('monster');
    res.send('Monster cookie cleared');
});

app.get('/set-session', (req: Request, res: Response) => {
    (req.session as any).userName = 'Anonymous';
    (req.session as any).colorScheme = 'dark';
    res.send('Session variables are set');
});

app.get('/get-session', (req: Request, res: Response) => {
    const userName = (req.session as any).userName;
    const colorScheme = (req.session as any).colorScheme || 'dark';
    res.send(`User Name: ${userName}, Color Scheme: ${colorScheme}`);
});

app.get('/clear-session', (req: Request, res: Response) => {
    (req.session as any).userName = null;
    delete (req.session as any).colorScheme;
    res.send('Session variables are cleared');
});
app.use((req: Request, res: Response) => {
    res.status(404).render('404', { title: '404 Not Found' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    console.error('** ОШИБКА СЕРВЕРА: ' + err.message);
    res.status(500)
    res.render('500')
})

if (require.main === module) {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`)
    })
}

export { app }
