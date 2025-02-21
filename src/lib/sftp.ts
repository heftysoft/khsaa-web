import { sftpConfig } from '@/configs/sftp';
// import Client from 'ssh2-sftp-client';
import { Client } from "basic-ftp";
import { Readable } from 'stream';

function formatFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-') // Replace non-alphanumeric chars (except dots) with hyphens
    .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens
}

export async function uploadFile(buffer: Buffer, filename: string): Promise<string> {
  const sftp = new Client();
  sftp.ftp.verbose = true
  try {
    await sftp.access({
      host: sftpConfig.host,
      user: sftpConfig.username,
      password: sftpConfig.password,
      secure: true,
    })
    const sluggedFilename = formatFilename(filename);
    const uniqueFilename = `${Date.now()}-${sluggedFilename}`;
    const remotePath = `${sftpConfig.uploadPath}/${uniqueFilename}`;
    const stream = Readable.from(buffer);
    
    await sftp.uploadFrom(stream, remotePath, {});
    
    return `${sftpConfig.publicUrl}/${uniqueFilename}`;
    
  } catch(err) {
    console.log(err);
    return ``;
  } finally {
    sftp.close()
  }
}