import multer from 'multer';

const MINE_TYPE = {
  'image/jpg': 'jpg',
  'image.jpeg': 'jpg',
  'image/png': 'png' 
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MINE_TYPE[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

export default multer({ storage }).single('image');