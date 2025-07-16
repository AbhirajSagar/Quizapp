export function getUserNameByFileName(fileName)
{
    //quizzes/Wru-1752557015991-Abhiraj Sagar.json
    const parts = fileName.split('-');
    return parts[2].replace('.json', '');
}