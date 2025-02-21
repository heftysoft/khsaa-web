export const sftpConfig = {
  host: process.env.SFTP_HOST,
  port: parseInt(process.env.SFTP_PORT || '22'),
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD,
  uploadPath: process.env.SFTP_UPLOAD_PATH || '/uploads',
  publicUrl: process.env.SFTP_PUBLIC_URL || 'https://your-domain.com/uploads',
};