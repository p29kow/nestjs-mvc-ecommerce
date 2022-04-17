import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

export const saveImage  = {
    storage: diskStorage({
        destination: function (req, file, cb) {
            const isValid = FILE_TYPE_MAP[file.mimetype];
            let uploadError = new Error('invalid image type');
    
            if (isValid) {
                uploadError = null;
            }
            cb(uploadError, 'public/uploads');
        },
        filename: (req, file, cb) => {
        const fileName = uuidv4();
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}.${extension}`);
        }
    }),
}
