export const supportsShare = () => typeof navigator.share !== 'undefined' && navigator.share;

export async function nativeShare(title: string, description: string, url?: string) {
    try {
        await navigator.share({title, text: description, url});
    } catch (error) {
        console.log('Error sharing: ' + error);
        return;
    }
}
