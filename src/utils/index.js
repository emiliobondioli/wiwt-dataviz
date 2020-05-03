export function sortByDate(items) {
    return items.slice().sort((a, b) => {
        return a.date - b.date;
    });
}

export function getLocation(coords) {
    return geocoder.reverse(coords.Wa, coords.za)
        .then(function (result) {
            return result
        })
        .catch(function (error) {
            console.log(error)
            return false
        })
}

export function geoDistance(a, b, unit) {
    const lat1 = a.Wa
    const lat2 = b.Wa
    const lon1 = a.za
    const lon2 = b.za
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344
        return dist;
    }
}

export function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export function getCityAndCountry(results) {
    if (results[1]) {
        var country = null, countryCode = null, city = null, cityAlt = null;
        var c, lc, component;
        for (var r = 0, rl = results.length; r < rl; r += 1) {
            var result = results[r];

            if (!city && result.types[0] === 'locality') {
                for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                    component = result.address_components[c];

                    if (component.types[0] === 'locality') {
                        city = component.long_name;
                        break;
                    }
                }
            }
            else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
                for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                    component = result.address_components[c];

                    if (component.types[0] === 'administrative_area_level_1') {
                        cityAlt = component.long_name;
                        break;
                    }
                }
            } else if (!country && result.types[0] === 'country') {
                country = result.address_components[0].long_name;
                countryCode = result.address_components[0].short_name;
            }

            if (city && country) {
                break;
            }
        }

        return { city, cityAlt, country, countryCode }
    } else {
        return false
    }
}