import multer from 'multer';
// Configure storage for multer
const storage = multer.memoryStorage();
// File filter (optional, to accept only images)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed'), false);
    }
};
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter
});
//# sourceMappingURL=upload.js.map