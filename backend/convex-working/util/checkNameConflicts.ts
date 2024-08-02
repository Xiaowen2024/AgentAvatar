import { readdir, stat } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);

async function getAllFiles(dir : string) : Promise<string[]> {
  const subdirs = await readdirAsync(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = join(dir, subdir);
    return (await statAsync(res)).isDirectory() ? getAllFiles(res) : res;
  }));
  return files.flat();
}

async function checkNameConflicts(dir : string) : Promise<void> {
  const files = await getAllFiles(dir);
  const fileNames = files.map(file => file.split('/').pop());
    const nameCounts = fileNames.reduce((acc: Record<string, number>, name : any) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const conflicts = Object.entries(nameCounts).filter(([name, count]) => count > 1);

  if (conflicts.length > 0) {
    console.log('Name conflicts found:');
    conflicts.forEach(([name, count]) => {
      console.log(`- ${name}: ${count} occurrences`);
    });
  } else {
    console.log('No name conflicts found.');
  }
}

checkNameConflicts('../convex').catch(console.error);