workspace "Leren Lezen" "C4-model van de huidige spelopzet" {
    model {
        speler = person "Speler" "Een kind dat lees-, reken- en klokoefeningen speelt."

        lerenLezen = softwareSystem "Leren Lezen" "Een statische browserapp met educatieve spelmodi." {
            browserApp = container "Browserapp" "Toont het startscherm, start spelmodi en beheert de actieve sessie." "HTML, CSS en JavaScript ES-modules" {
                navigatie = component "Navigatie en opstart" "Start de app en wisselt tussen het startscherm en de spelmodi." "main.js en router.js"
                spelmodi = component "Spelmodi" "Voert emoji-, CVC-, klok- en rekenspelletjes uit." "modes/*.js"
                kernlogica = component "Kernlogica" "Beheert state, beloningen, selectie, timers, opslag en spraak." "core/*.js"
                gebruikersinterface = component "Gebruikersinterface" "Levert DOM-helpers, overlays, confetti en de prijzenkast." "ui/*.js"
                speldata = component "Speldata" "Bevat woorden, klokuren en rekenopgaven." "data/*.js"
            }
        }

        browserOpslag = softwareSystem "Browseropslag" "Bewaart sterren, stickers en de afkoeltijd lokaal in de browser." "localStorage"
        browserSpraak = softwareSystem "Browser-spraak" "Beschikbare browserdienst voor toekomstige gesproken feedback; nog niet gekoppeld aan de oefeningen." "Web Speech API"

        speler -> browserApp "Speelt oefeningen en bekijkt beloningen"
        navigatie -> spelmodi "Start de gekozen spelmodus"
        navigatie -> gebruikersinterface "Werkt schermen en de prijzenkast bij"
        spelmodi -> kernlogica "Leest en wijzigt de spelsessie"
        spelmodi -> gebruikersinterface "Rendert oefeningen en feedback"
        spelmodi -> speldata "Leest oefenmateriaal"
        kernlogica -> browserOpslag "Leest en bewaart voortgang"
        kernlogica -> browserSpraak "Bevat een nog niet aangeroepen spraakadapter"
    }

    views {
        component browserApp "Spelopzet" {
            include *
            autolayout lr
            title "Leren Lezen - opzet van het spel"
            description "C4-componentdiagram van de statische browserapp en gebruikte browserdiensten."
        }

        styles {
            element "Person" {
                background #084C61
                color #FFFFFF
                shape Person
            }
            element "Software System" {
                background #2A6F97
                color #FFFFFF
            }
            element "Container" {
                background #468FAF
                color #FFFFFF
            }
            element "Component" {
                background #EAF4F4
                color #17324D
                stroke #2A6F97
            }
        }
    }
}
