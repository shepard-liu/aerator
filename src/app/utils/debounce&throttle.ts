/**
 ** 防抖和节流函数
 * @author shepard
 */

/**
 * 防抖函数
 * @param fn 被防抖函数，返回值将被舍弃
 * @param ms 延迟时间milliseconds
 * @returns 
 */
export function debounce<T extends (...args: any) => unknown>
    (this: any, fn: T, ms: number): (...args: Parameters<T>) => void {

    let timeOut: any = null;
    const _self = this;

    return function (...args: Parameters<T>) {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => fn.apply(_self, args), ms);
    };
}

/**
 * 节流函数
 * @param fn 被节流函数，返回值将被舍弃
 * @param ms 延迟时间milliseconds
 * @returns 
 */
export function useThrottle<T extends (...args: any) => unknown>
    (this: any, fn: T, ms: number): (...args: Parameters<T>) => void {

    let shouldRun = false;
    const _self = this;

    return function (...args: Parameters<T>) {
        if (!shouldRun) return;
        shouldRun = false;
        setTimeout(() => { fn.apply(_self, args); shouldRun = true; }, ms);
    };
}