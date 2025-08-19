// Firebase Storage Functions
import { 
  ref as storageRef, 
  uploadBytes, 
  uploadBytesResumable,
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from './config';

// Storage paths
const STORAGE_PATHS = {
  PROPERTIES: 'properties',
  USERS: 'users',
  DOCUMENTS: 'documents',
  TEMP: 'temp'
};

// File upload operations
export const storageOperations = {
  // Upload property image
  uploadPropertyImage: async (propertyId, file, imageName) => {
    try {
      const fileName = `${Date.now()}_${imageName || file.name}`;
      const imageRef = storageRef(storage, `${STORAGE_PATHS.PROPERTIES}/${propertyId}/${fileName}`);
      
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        success: true,
        downloadURL,
        fileName,
        fullPath: snapshot.ref.fullPath,
        message: 'Property image uploaded successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to upload property image'
      };
    }
  },

  // Upload user avatar
  uploadUserAvatar: async (userId, file) => {
    try {
      const fileName = `avatar_${Date.now()}.${file.name.split('.').pop()}`;
      const avatarRef = storageRef(storage, `${STORAGE_PATHS.USERS}/${userId}/${fileName}`);
      
      const snapshot = await uploadBytes(avatarRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        success: true,
        downloadURL,
        fileName,
        fullPath: snapshot.ref.fullPath,
        message: 'Avatar uploaded successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to upload avatar'
      };
    }
  },

  // Upload document (booking confirmations, receipts, etc.)
  uploadDocument: async (userId, file, documentType = 'general') => {
    try {
      const fileName = `${documentType}_${Date.now()}_${file.name}`;
      const docRef = storageRef(storage, `${STORAGE_PATHS.DOCUMENTS}/${userId}/${fileName}`);
      
      const snapshot = await uploadBytes(docRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        success: true,
        downloadURL,
        fileName,
        fullPath: snapshot.ref.fullPath,
        documentType,
        message: 'Document uploaded successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to upload document'
      };
    }
  },

  // Upload with progress tracking
  uploadWithProgress: (path, file, onProgress) => {
    return new Promise((resolve, reject) => {
      const fileRef = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress, snapshot.state);
          }
        },
        (error) => {
          reject({
            success: false,
            error: error.message,
            message: 'Upload failed'
          });
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              success: true,
              downloadURL,
              fullPath: uploadTask.snapshot.ref.fullPath,
              message: 'Upload completed successfully!'
            });
          } catch (error) {
            reject({
              success: false,
              error: error.message,
              message: 'Failed to get download URL'
            });
          }
        }
      );
    });
  },

  // Delete file
  deleteFile: async (filePath) => {
    try {
      const fileRef = storageRef(storage, filePath);
      await deleteObject(fileRef);
      
      return {
        success: true,
        message: 'File deleted successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete file'
      };
    }
  },

  // Get file metadata
  getFileMetadata: async (filePath) => {
    try {
      const fileRef = storageRef(storage, filePath);
      const metadata = await getMetadata(fileRef);
      
      return {
        success: true,
        metadata
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to get file metadata'
      };
    }
  },

  // List files in directory
  listFiles: async (directoryPath) => {
    try {
      const dirRef = storageRef(storage, directoryPath);
      const result = await listAll(dirRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);
          
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            downloadURL,
            size: metadata.size,
            contentType: metadata.contentType,
            timeCreated: metadata.timeCreated,
            updated: metadata.updated
          };
        })
      );
      
      return {
        success: true,
        files,
        directories: result.prefixes.map(prefix => prefix.fullPath)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to list files'
      };
    }
  }
};

// Image optimization utilities
export const imageUtils = {
  // Validate image file
  validateImage: (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        message: 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)'
      };
    }
    
    if (file.size > maxSize) {
      return {
        valid: false,
        message: 'Image size must be less than 5MB'
      };
    }
    
    return {
      valid: true,
      message: 'Image is valid'
    };
  },

  // Resize image before upload (client-side)
  resizeImage: (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            }));
          },
          file.type,
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  },

  // Generate thumbnail
  generateThumbnail: (file, size = 200) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        
        // Calculate crop area for square thumbnail
        const minDimension = Math.min(img.width, img.height);
        const x = (img.width - minDimension) / 2;
        const y = (img.height - minDimension) / 2;
        
        ctx.drawImage(img, x, y, minDimension, minDimension, 0, 0, size, size);
        
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], `thumb_${file.name}`, {
              type: file.type,
              lastModified: Date.now()
            }));
          },
          file.type,
          0.8
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
};

// File type utilities
export const fileUtils = {
  // Get file extension
  getExtension: (filename) => {
    return filename.split('.').pop().toLowerCase();
  },

  // Generate unique filename
  generateUniqueFilename: (originalName, prefix = '') => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = fileUtils.getExtension(originalName);
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    
    return `${prefix}${prefix ? '_' : ''}${baseName}_${timestamp}_${random}.${extension}`;
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Check if file is image
  isImage: (file) => {
    return file.type.startsWith('image/');
  },

  // Check if file is document
  isDocument: (file) => {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    return documentTypes.includes(file.type);
  }
};
