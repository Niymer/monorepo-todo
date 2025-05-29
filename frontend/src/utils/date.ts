/**
 * 时间转换：年-月-日 / 年-月-日 时:分:秒
 * @param utcInput 毫秒时间戳、数字字符串、ISO 字符串或 Date 实例
 * @param type 'ymd' | 'hms' | 'ymdhms'
 */
export function utcToDate(
    utcInput: number | string | Date,
    type: 'ymd' | 'hms' | 'ymdhms' = 'ymd'
): string {
    let date: Date
    if (utcInput instanceof Date) {
        date = utcInput
    } else if (typeof utcInput === 'string' && /^\d+$/.test(utcInput)) {
        date = new Date(parseInt(utcInput, 10))
    } else {
        date = new Date(utcInput)
    }

    if (isNaN(date.getTime())) {
        const ts = Date.parse(utcInput as string)
        date = isNaN(ts) ? new Date() : new Date(ts)
    }

    const Y = date.getFullYear()
    const M = String(date.getMonth() + 1).padStart(2, '0')
    const D = String(date.getDate()).padStart(2, '0')
    const h = String(date.getHours()).padStart(2, '0')
    const m = String(date.getMinutes()).padStart(2, '0')
    const s = String(date.getSeconds()).padStart(2, '0')

    switch (type) {
        case 'hms':
            return `${h}:${m}:${s}`
        case 'ymdhms':
            return `${Y}-${M}-${D} ${h}:${m}:${s}`
        case 'ymd':
        default:
            return `${Y}-${M}-${D}`
    }
}
