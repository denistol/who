export const currencyFormat = (
    value: number,
    locale = "en-US",
    currency = "USD"
) => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0
    }).format(value)
}

export const shuffleArray = <T>(array: T[]): T[] => {
    const copy = [...array]

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }

    return copy
}

export const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, s*1000))

export const indexToAmount = [
    500,
    1000,
    2000,
    4000,
    8000,
    16000,
    32000,
    64000,
    125000,
    250000,
    500000,
    1000000
]