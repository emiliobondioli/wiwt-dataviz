export function sortByDate(items) {
    return items.slice().sort((a, b) => {
        return a.created - b.created;
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