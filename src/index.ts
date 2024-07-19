import express, { Express, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { engine } from 'express-handlebars'
import multer from 'multer'
import fs from 'fs'
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

app.use(express.urlencoded({ extended: true }))

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

app.use((req: Request, res: Response) => {
    res.status(404)
    res.render('404', { title: '404 Not Found' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    console.error(err.message)
    res.status(500)
    res.render('500')
})

if (require.main === module) {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`)
    })
}

export { app }
