export const getPraginationItems = (page, lastPage) => {
    if(typeof page !== "number" || typeof lastPage !== "number") return [];

    if(lastPage <= 1) return [1];

    // Clamping page into range
    const current = Math.min(Math.max(page, 1), lastPage);

    let middle = [];

    // start
    if(current === 1 || current === 2) {
        middle = [2, 3].filter((n) => n <= lastPage);
    }

    // end
    else if (current === lastPage || current === lastPage - 1) {
        middle = [lastPage - 2, lastPage - 1, lastPage].filter((n) => n >= 2);
    }

    //middle
    else {
        middle = [current - 1, current, current + 1];
    }

    const items = [1];

    const firstMiddle = middle[0];
    const lastMiddle = middle[middle.length - 1];

    // left spread ...
    if(firstMiddle > 2) {
        items.push("...");
    }

    for (let i = 0; i < middle.length; i++){
        const n = middle[i];
        if(n !== 1 && n !== lastPage && n >=1 && n <= lastPage) {
            items.push(n);
        }
    }

    //right spread
    if(lastMiddle < lastPage - 1) {
        items.push("...");
    }

    if(lastPage !== 1) {
        items.push(lastPage)
    }

    return items
}