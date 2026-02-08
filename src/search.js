function execute(key, page) {
    // NOTE: page phải là string, không phải number
    if (!page) page = "1";
    
    // Encode search key
    let encodedKey = encodeURIComponent(key);
    
    
    let url = `https://wattpad.com.vn/tim-kiem?s=${encodedKey}&page=${page}`;

    let response = fetch(url);
    
    if (!response.ok) return Response.error("Tìm kiếm thất bại");
    
    let doc = response.html();
    const data = [];
    
    doc.select(".truyen-list .item").forEach(element => {
        let name = element.select("a").attr("title");
        let link = element.select("a").attr("href");
        let cover = element.select("img").attr("src");
        
        // Xử lý URL
        if (cover && cover.startsWith("//")) cover = "https:" + cover;
        if (link && !link.startsWith("http")) link = "https://wattpad.com.vn" + link;
        
        data.push({
            name: name,
            link: link,
            cover: cover,
            description: element.select(".description").text(),
            host: "https://wattpad.com.vn"
        });
    });
    
    // Tìm trang tiếp theo
    let nextPage = null;
    let nextLink = doc.select("a.next").attr("href");
    if (nextLink || data.length > 0) {
        nextPage = (parseInt(page) + 1).toString();  // NOTE: next phải là string
    }
    
    return Response.success(data, nextPage);
}

