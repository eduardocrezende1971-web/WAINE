import { useState, useRef, useEffect } from "react";

// ── Ícones servidos de /public (sem base64 inflando o bundle) ─────────────────
const ICONE_CAPA = "data:image/png;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/wAARCAREBEQDACIAAREBAhEB/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMAAAERAhEAPwD5/ooooAKKKKACiiigAooooAKKKKACiiigBaSiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKWkooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigANFFFABRRRQAUUUUAFBoooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopaACkoooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA70UUUAFFFFABQOtFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAG14TtRe+K9Itj0ku4gf8AvoV9cMcsSO5P86+UvAP/ACPmhf8AX7H/ADr6tHSvHzTeKO3CdQrzr4zat/Z/gg2kbYlv5xEcf3F+Y/0r0QmvEPjxct9u0a1B+VYpJD9SwH9K4sHDnrRTOiu+Wm2ePE5NJRRX0p5QUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUtJQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFS0AJRRRQAUUUUAFFFFABRRRQAUUUCgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDZ8K3YsfFWlXJ4Ed3G2f+BCvrhyAzD3NfGUTtHIrqcMpDA+4r680y9XUNIsr1DkXFvHLn6qDXk5otIyOzBvVouM9eEfHIH/AISHTG/hNoQP++jXuRbmvIfjpZbrfRr/ANDJCf0IriwErYiNzoxK/ds8Wooor6M8sKKKKACiiigAooooAKKKKACiiigApaSigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApaSigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAFFfR3wm1X+0vAdtCxzJZSNbt9PvL+hx+FfONeofBfW/sevXelSPhL2IMgP99OR+YLVyY6nz0Xbdam+Hly1Ee6M2K4f4p2B1LwNdFRl7R1uBgdgcN+h/SuxaSqd7FHd2k1tKMxzRtG49mBB/nXz1OfJNS7HqShzRaZ8nngumtPBIMR2OOyetMrqfFXgxPB2spFqdy7iaJpoBboPnQEjk54OQRiuRk+/+VfTYV05U3KGyPLrOUZWY6igUV1nO3cKKKKBBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFLSUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXt37PunlNH1nUSvE08cKn/cBJ/wDQq8Sr6c+EOnf2f8O7AlcPdvJcN9C2B+iiuTHTSpW7s2oRvUR3lFFFeIeoFFFFABRRRQAUUUUAFFFFABRRRQAUlLRQAlFLSUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAJS0UUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXqEmTWXwytY3DIyvNGyHsdwI/Q1f+E2k/2N8O9PRl2zXebqT1y549sgKKb46t3l8I3jKM7XR2x3Ab/AOuKtoxh8Ew8DAGOK8mtVcpzh5o7qcLRjP1OlooorzjvCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr179nWzWXxTrl8wybTT4o0PoZJST/wCgV5DX0H+zvbBNB128A+ae8jhJ9kj3D9XNcuMlajL5G+HV6iPYqKKK8I9YKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvov9ny3MfgnVZjyJtRwPwjUf1r50r62+E9j9j+G+lhuJJ/Mnf/AIE5x+gFcOPlajbuzqwivM7iiiivIPRCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr7K0ay/s7QbCxx/x728cZ/4CoH9K+Q/D9p9v8RaZZ4z591FH+bgGvsvHFeRmkrqMTtwa3YtFFFeKegFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHQeBLP+0PHmh22NwN2jsP9lTuP6CvrjvXzN8GLP7X8R7VyMrbQyTH8sf+zV9Mt0J9q8XM5XqRj2R6OBVoNiUUUV5Z3hRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB7d8AbHA1y/I7xQKfwLH+Yr2Y15z8ELLyPAcs+OZrx/wBAB/jXoxBHbA9TXz2Mlz15M9bDq1NCnpWNLrVrEzKZUyDg8itKXcVbkAY7c14R4inkj1+8XzGAEhwAa1weDjieZX2sa1MQ6Vmlue1f29bf30/Oj+3rb+9H+dfPv9pTf89X/Olj1KZpFXzn5OOtdv8AYsP5jD683pY+gv7etv78f50DXLcnAaP86+e7m+nZf9c4yc8GqsV9KsiHzpODnrSWSwa+IPr0r2Pp23nE6blwfQipa5DwJrEdxbywvJh4lDLk9UPGfwPH4iuvBzXjVqXspuB3wkpx5kFFFFZFhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH1H8N7L+z/AAFpcZGGkQyt9SeP0Arq+9Z+kxLBoljCgwsdvGoH4Vorgu5+gr5StLmnJ+Z70I8sUiHU38vRrx/SF/5GvAdaO7VZj/tV774kYJ4f1Bv+mDV4FqcRm1Roxw8koUH64r3MmkoUm32PMx6vNJEYP9N+2vGfvD7w1u3tKkn2GiFY9ke6DcVxn8K6YWX2H7TBu3p8jq3qK8jHYj/aoQXTU7sNS/cyMkapJI4UE5Y4r0KDw7d3GnRMszhmQEgCsXR/CMc3iKzZpiYiwbjvjmvU0UICqtgDtRmuMjGUIw3sLBYduMpHnvhWefRtVnSctEjjBJBwwH8R74Hr0HrXpqMHQOpyrAEH1Brltdt43n3OobKlcEdQex9q19DkRdHt03DEakD2GTjr7V52JrLEclXZtanXRpum3Bmlmim5z3pa5ToFooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD7HsxiyhH+wP5UTjbNGw7EVHpsom0u0lByGiU/pTrtgsBJ7c149ndnvLVI57x0xGgRr2adAfyNfPpllbVrzc2cTHFfTGqwR3Vk0c0YkXcDtPciqEFnaW8e2Cziix3CDmupRTjvqK5xWi+CbnUWS9up3hgYAhQOWHb6Vl+IdMjsr0wpPvbHcZxXqVvqcK/uy20jpu71wPjGeFNcNzAoZNoEij1Pf9aabsaR7xMrTCIwjN1jaufu/EU0Wsu0KqYieoPWqj6pcXTSx2gC4UkY7Vxk2t39rfSBxnaSGXFOMU1Yzbsz1JtfimsnaQEZTOTmum05dthb7T8pjGB+FePR65/aGgLLG+JFGGUnpXqfh+5N3oFtJyJEXa3fkVwYqmoHTRldF+9j32cuOu3IOasaJCq6Tb7CCNg/HHQ/zqMPmM45HQ/jVzS18qBoOyHcv0PNcq2OkvUUUUgCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA+xvDcvneFNJlBzvtIz/AOOitG4XzIpEPRkIrG8Du7eAtFL/AHvsijP04/pW+CO+CDxXjVNJM+gh8KOJ8FvdxGSCWQF45GikVl4yOM+w6V18gBXBANcL4mvZNJvzcQg8nDH3rJfx5ePF5e7nGM9605HPZmTaW51ms6vBpUTSMyiTb8oJrxXxBrclxqrsnzAjlj35rR8R6/cXk7yyZIjGef4q5KTUYLkbpNiv9Riumlh+UyqVLrQ19P1aH7TvHlqEXHLcVy/iC4Q3RcEBXk3D1qy2nQzkywMjAdaztU0iWeFDGcleVJrSKSlcyk243uX7JmtbWBlJVZRkfWvSPC8H2bSY7tCRcJk4PRl9DXnNu0sumLgcoa9C8FXXn6cYJDkZ4PpRX1iKkvePQRcJcWqXEZB3Lyo7+1aeix5tZJSP9ZJgZ9F4/nmuOhI0e/H2j5tPnYbW7xH/AAr0G3SKOFI4MeWowuOmOteY9NDvjqrkhUEFTyDVXTLgyW3lSf66E7HHrjofyq1n0NZNwwsdcgnHEd0vlSf7w5BoiU7G3RTV4XApxqCgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPpnwBcCfwHo7DqIAh+oOK6QHFcF8KrjzfA0Mef8AVTSL/wCPZ/rXdSHbHk9q8Wsv3kj36LvTRgeJtOj1KxlikGWxlD6GvDdR0G+sZ3jeNgFOMkV6X4q8VR2EhSI5ftjtXn8/im+1KZogVAJ74q4bFSWphtbxKwSeUZ74PSpx4dt7y2IhAfPRk5pNZ0aGGEThwZmUkkHhq5fSdcv9Hm/dyMU9DyKvm10Ich+qWN1pkht5C4XsR3qjp9zNFcc3DkEdGNaeo6m+rTM7ksW6+1Z9to7vMHbcF965pyu9DHd6F9NSeRGSWcZ9+gqTwJrr2niK5h3kxMu7HuKx9SsmIITPHWqXh+G7g8RJOnyoqkOzdMHoPzpqTcWmaRgz2bX7gajCREcMOg9KvX2v6lpfhP7eJyL2OURB14yCcA47etVLW3hnsrSe2YOxXLEZGfXqOahn1Ofw74h83U7eC902VPLlibnA9R6dKwjBSqJG7nyQbPXIz5kCyA8MoP6VleJonbSlu4hmazlW4UeoB+Yfln8q0LCS3l0+Ca0bdbvGGiPquOP0qaSJZIXjcZRwVYexrKLs7l72FtZUnt45EOUZQQfWp+1c54ZuJI4ptKuT/pFm21Sf4ozyp/p+FdEDxQ1qNbAOlLRRSGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAfQXweuBN4FROpiuJF/PB/rXfk5GD0NeWfBGfdoeoQk/cnDD8R/9avUiOK8XEK1WR9DhneCPDPiTpc+m689wpJikG4N9TXJaTeyG8aUtkxtxX0V4i8M2Hia0EN6h4HysOorzC8+EM1jJI2nXCSI3I3HmrjLuOSf3lObXzd2gWUZIHJP4VmvEs6kNg5pdR8Pavpa5mtX2/wB5OazILtg+xshu+a0Tj0M3F/aLthapb3DIo+YnitiOKVbhPnIQ5BANbvhrwvbXFut3I5dnH3R0FbU/g0Da0bsuO3WoclexNk9DhdetQ9oMDrXmd9bSWmoxPyMSjB/GvbtR8O3CIVc+Yh9q4PXNAwxR0BDdK1XwicXsdLpmoRvY27Y3/MAR/hWj4haLU7M2tzDugbrtPzD3Hp+FctoFvdPpaW0LCPyz98jOfQfWtm+njsoWN3KZ7t/+Wac4HoB/n8KxejBuwzwxa3kEUq2ms+ZAjbPst9CWMfHGGUjit2KS9X7XAUBaPa/yEsCGB/oKwfDmoxPaXl9CMyBxGUf5Wxj0+pNbtnq9hYIxlukkmlOZHHIB6AfQDFZTWtjWErxOX1KPVmeHVo7BzeWj7lAYHzE/iU49R/IV1unX9rqVjFd2riSGUZBHBHqD7g8VYS7tpwGSeNwfRq56fOh62ZYQRY3rZUjpHLjkfQ4z9c+tT8Stb1NF7stzqgaWsi+1+xsWWJ5PNum/wBXbQ/PI59gP55xVnTZL+aJpr2OOEucpAhJMa+jHu386mzWrLui9RRRSGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB6h8Ebvy9R1S0J/1kSSAfQkf1r2avnf4WXYtfHVqhOFnjeM/lkfqK+iCcGvHxsbVbnu4GV6VgOAOTSE57VDdyPHbu0a73AyqjqaboGsW2vWj3FuwzGxR0PVT/8AXrjs7XOznSlyl2OPzsLnB7VR8b+Crq38L20+kxiZw26ZB1IxxXTaPo7XDC4nUiIH5VPVq6lQAAAAB6Cs/aOLuOpDmVmfPEHi3UNHkS3vIWGBgg8GuptPGdvcRr8zJk96r/H3Q/sthbarbfu97hH28HJrySxgvbq1MtuznZyy55q7c/vCi3T9w99j1y2ngJlYNkdK4nXnt5JmKjjt7VxOj63Mh8q4dgRwc+tat3qSyJndUKLTFuV4XEMzbFwG6/SvL/iJexxavIIHwDz9Sa9Ie7VSWJ4Aya8N8RXp1HVnnOSFcj8O1OnJ+1NeS9NyOpKvGnigMv3zk/4VoePb6V/HV0BIQu1QAOBXMrKR06+1L4yYP+Ev8w/dKKB9MV1cv7y/kc6ehk3FnNJN5oZ9jdwa0NK1bxBpUhNlcPdRnG2GVtxHHb8MVPJK6sg25BU8+gxV3SbLzY1ZQQO5pVI8wRk0aFx4u1+0jsf30mxoy+5GO5XzgqfVeM1Y0/4j6jDqYGoKZbV1A2Z6e/+NTzWkMltGCgyAelV30CC4lU4xtwawhBR2Lk3LqenWniKNo1eR1Ksu5SrZyKvjxBYj/lrXARxJYoir/yzGBVIaiSx5q+RPYi3mei3Hi/SrZf3lwM+gqimv6trzAaJaeRakkG9uQQuP9heCfqf0qD4Z+G7XW7641e/iWcWzhYUdcrux944r1jaqLgYAFRJxi7JFKDPOh4d8RaRbtfjxNcXl3uDPFKBsZeMgfp+VdjpepRapZJcRfKx4kjPVG/un6frVXVtVtIIH3yL5fIY5+8e6r6+/p3qjpV6mqLI8MckBXpvjKbh6jPaobcle2hpFcrtfU6miqcU0kY2zEEf3v8AGrIdCMhgRWTLuOoooFADaWiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAyo7iSwvYbq3OJEbI+nv7V79oviGz1zSku7eRclR5iZ5Q+9eAVNb3M9pIJLeZ4nHRkYg142KwirJOOjPRwuKdJ8r2Pe1lnmYJaQNLnq5+VVrqdC8FRLcLqOpD7TdL/qoz92H6e9ePeFvE3iSyu0jthLfQs2DGysxx+RNfRGnyzvZxNcRGOXaCwORg/SuKnh40n717nVUxDqLljovxLccIUcjFKVwDip881HM6JC7yMqIqksx7CulLU52j5N+L0sl54imgiuJlbfwU5UZx2Fcvp8eq+HrPyrdRds2DvkXPP4dq6PXp01rxbeXlumIpXIVj2HrW9osNsi+W4UrgZb3qlJ81y7e6kc14b1AzCa61DTYobgSEKsAOAuOvHQ12C6lFLEQzAKBwGFasGiwIzS25CMecjpms3UNNjMzZAgnAxv8A4HpyleQRu9DK1OdW04xRSDeGIGOu1uMfng/hXkviLT5dPvMSJtVsr+PNet/Y1htw00ZViMq3rXMa9pp1mUjynkW3Bb5fXp3raipObSWhe6PJzKx7n86yXmZ7yT/aXFat/A1nfTW7AjY3GfTqKxbWQTanIQfu8V6cFq2c7bsW0jCsM5wPSr1kiQuQrtg89aiK/un5wTUAlMVwEbpWGI95mkFY1kn4xmpEnVZB81VrfDnIIO4UkluwDP09PWnRVlYUmbS6gC0KnIVTxXX6FdaSgM2pXcCqB91pBkDtxXl9z9oktvKt2KSn+InGKxJtFu0Vri7PnIvVzMTgegHrTraqxKa3PevDXxK0DRotanZ5GtxKZIIo1G6Y4Awo+oH4msXxX8WPEPiGNrHQYGsLeVeS3+ucem77qfXk+1eIWFwn2hDnPNelaTbeY8RIUKnzAjqTjivOnTitTRy7B4U8N3st0qCFvNkbe+RyPb6/zr3HQNGTSrIIQDcMP3jD+Q9hWf4U0VLO1F3Im2eUZAP8I9K6XHpXLOXMNJWuzKtDKbHy7iMD/eHWsLUbiGy1eJF5LQ4XHr1xn8a7AjcCDXBeJpYIPGkUDoR/o2QyL+RPv8AyxRQXM7BUm6cb7nU6Lqq6lZK+QHU7XX0NaSn3rgPDt81nq627Lt8wlSAOjf/AF67xRyaJxs9OoUpc8QbqaWlxRSNQpKWkoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPYqu6dq19pUqyWdy8RBzgHIP1FUqK99pSVmcabTuj2Pwj45GvSGzu0WO92llK9HA/ka67qK+ftBvRp+u2N0xwsc6lj7Zwf519AoQyqRyCMivExlBUprl2Z6+ErOpD3uh85ePbNtJ+IGoxsuFWfeP907Sfyzn8K6vw/co8YYbUOMgntT/AI/aL5Op2GtRD5LpDFI3owGQfxX/ANBryyy12+to1ESlsDH4VztKLNqd7Hu1nrEUUZyykr1walXVrK4DGZUDtxlWrwM6/qTFiAcd+aim8Q34IBkZTjpnpUuLlsbqNz3i81vTooGRmTZ3JNcfqniK4uybTQ7eW4mfjMSE7frjp+NeWy6/qBQqJTyMZ611Hgvxre+H5pkkj+02s67JEbqM9wfpxihU3HV6lqHK7nM/EHwjf6PNDqVwMR3X+sUH/VyentkfyrziU+Vfo3+0K+jdQEOu6UbeS6kEEy7SrJ8wzxg88EHvXKr8DtHkQM2sX2eufKT/ABrvw2KhGNqjsZ1qXM+aJ4tNcKtxg9zVS9k2OjL2FetXfwZsoZi6arclVJxmJea53UvhdcyXBXTr6ORwM7JlKGtm6ctYsjle1jntO1eFFG44J4qe71ubOI5UVT0xiqV94K8R6Ud01iSOoMTBwf61gXMNzGSk0Mke3ruUjFOcJTjZAlYtTaxd72CXLoCedhxzVZdRu7iTbcXMsv8AvOTUNvDDLJ85Yj1B6V0Wm6Ja+UJlBKnoSeo9azdGqlZj3Ll2u3SoXAH3xXf+EDvFsv6V51fSvNbiGNfkU5z3rufBV3Glsm9+Yx0Hesa9NwgrhGN3Y9j0/UoLUC2eXOcEN3Bro4po5kV1cYxnkjP4ivKbRml1iLzFA8whgfTitG8mXSJG/eYRvX3rg9k3GxtZbHpHHrXAXemvL4ulvGLuhnVAzdlIAArS8MeJYNX22zsBMqgAk/eFXRA0niNAvCLsLY9+f6CnTjKknczqWnaPmavh21EFsZmzucbV+gOf5104+VVA9Ko2dtyAB8oxx7VeJ+euao+ZnfBKMUg7UClPSm5qSh3WikFFAC0lFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/2Q==";
const ICONE_APP = "data:image/png;base64,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";

const G = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=DM+Sans:wght@200;300;400;500&display=swap');`;

// ── Paleta interior (claro, elegante) ─────────────────────────────────────────
const C = {
  bg:     "#F7F3EE",
  card:   "#FFFFFF",
  card2:  "#F2EDE2",
  border: "rgba(0,0,0,0.10)",
  text:   "#1A1410",
  sub:    "#3A2F26",
  muted:  "#6B5F54",
  gold:   "#C9A46E",
  goldD:  "#7D6238",
  goldL:  "rgba(201,164,110,0.12)",
  wine:   "#5B0F1A",
  wineL:  "rgba(91,15,26,0.08)",
  sepia:  "#5C4528",
  sepiaL: "rgba(122,92,58,0.08)",
  green:  "#1F4A30",
  greenL: "rgba(42,96,64,0.08)",
};

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "waine_uploads");
  const res = await fetch("https://api.cloudinary.com/v1_1/dfuqx38mo/image/upload", { method:"POST", body:formData });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Upload falhou");
  return data.secure_url;
};

// ── Otimização Cloudinary: gera URLs com tamanho/qualidade adequados em runtime
// Funciona injetando "w_X,q_auto,f_auto/" depois de "/upload/" na URL original.
// Se a URL não for do Cloudinary, retorna intacta.
const cldUrl = (url, w=400) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("/upload/")) return url;
  // Evita re-injetar se já tiver transformações
  if (url.match(/\/upload\/(?:[wqfgrhdcasezxylpvtbojkmni]_|c_|f_|q_)[^/]+\//)) return url;
  return url.replace("/upload/", `/upload/w_${w},q_auto,f_auto/`);
};

const loadFromServer = async () => {
  try { const res = await fetch("/api/save"); if (!res.ok) return null; return await res.json(); }
  catch { return null; }
};
const saveToServer = async (data) => {
  try { await fetch("/api/save", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ wines:data.wines, vineyard:data.vineyard, memories:data.memories }) }); }
  catch {}
};

const VINHO0 = [];
const sAccent = s => s==="Branco"?C.gold:s==="Rose"?"#B05070":s==="Espumante"?"#2A7060":C.wine;
const sLabel  = s => s==="Branco"?C.goldL:s==="Rose"?"rgba(176,80,112,0.08)":s==="Espumante"?"rgba(42,112,96,0.08)":C.wineL;
const getCastaFiltro = (grapes) => {
  if (!grapes) return null;
  const lista = grapes.split(",").map(g=>g.trim()).filter(Boolean);
  if (lista.length > 1) return "Blend";
  return lista[0] || null;
};



// ── Ícones SVG no estilo do KV (linha fina dourada) ──────────────────────────
const IconeKV = ({ nome, cor="#C9A46E", tamanho=22 }) => {
  const sw = 1.4; // stroke-width fino, editorial
  if (nome === "adega") {
    // Símbolo MEMORAVIN: coração invertido (linhas finas) + cacho de bagas em pirâmide
    return (
      <svg width={tamanho} height={tamanho} viewBox="0 0 48 64" fill="none" stroke={cor} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        {/* Pedúnculo */}
        <path d="M24 4 Q 23 5.5, 24 7 Q 25 8.5, 24 10" />
        {/* Coração invertido formando topo do cacho — duas curvas que descem e se cruzam em V no centro */}
        <path d="M24 11 C 18 11, 12 14, 12 21 C 12 26, 16 30, 20 32 Q 24 36, 24 36" />
        <path d="M24 11 C 30 11, 36 14, 36 21 C 36 26, 32 30, 28 32 Q 24 36, 24 36" />
        {/* Cacho de bagas — pirâmide invertida 3 (topo largo) - 2 - 1 */}
        <circle cx="14" cy="38" r="5" />
        <circle cx="24" cy="38" r="5" />
        <circle cx="34" cy="38" r="5" />
        <circle cx="19" cy="46" r="5" />
        <circle cx="29" cy="46" r="5" />
        <circle cx="24" cy="54" r="5" />
      </svg>
    );
  }
  if (nome === "mapa") {
    // Globo com meridianos (editorial, não 3D)
    return (
      <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12 L21 12" />
        <path d="M3.5 8 L20.5 8" opacity="0.6" />
        <path d="M3.5 16 L20.5 16" opacity="0.6" />
      </svg>
    );
  }
  if (nome === "memorias") {
    // Coração em linha fina (mesma família do símbolo)
    return (
      <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20 C12 20 3.5 14 3.5 8.5 C3.5 5.5 5.8 3.5 8.3 3.5 C10 3.5 11.2 4.5 12 5.8 C12.8 4.5 14 3.5 15.7 3.5 C18.2 3.5 20.5 5.5 20.5 8.5 C20.5 14 12 20 12 20 Z" />
      </svg>
    );
  }
  return null;
};

// ── Ícone de lixeira editorial (linha fina, mesma família do KV) ─────────────
const IconeLixeira = ({ cor=C.muted, tamanho=16 }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

// ── Tela de Capa ───────────────────────────────────────────────────────────────
const Capa = ({ onEntrar }) => (
  <div style={{
    position:"fixed", inset:0, zIndex:999,
    background:"#0D0D0F",
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between",
    padding:"0 0 calc(48px + env(safe-area-inset-bottom))",
    overflow:"hidden",
  }}>
    {/* Imagem de fundo */}
    <div style={{
      position:"absolute", inset:0,
      backgroundImage:"url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80')",
      backgroundSize:"cover", backgroundPosition:"center",
      opacity:0.35,
    }}/>
    {/* Gradiente escuro */}
    <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(13,13,15,0.3) 0%, rgba(13,13,15,0.5) 40%, rgba(13,13,15,0.85) 100%)"}}/>

    {/* Conteúdo */}
    <div style={{position:"relative",flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:0,width:"100%",padding:"0 40px"}}>

      {/* Símbolo (cacho dourado puro, sem container) */}
      <img src={ICONE_CAPA} alt="MEMORAVIN" style={{width:120,height:120,display:"block",objectFit:"contain"}} />

      {/* Linha decorativa */}
      <div style={{width:1,height:24,background:"rgba(201,164,110,0.6)",marginTop:8,marginBottom:20}} />

      {/* Nome */}
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,letterSpacing:"0.3em",color:"#F2EDE2",marginBottom:6,textAlign:"center"}}>
        MEMORAVIN
      </div>

      {/* Linha com ponto */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
        <div style={{width:40,height:0.5,background:"rgba(201,164,110,0.6)"}}/>
        <div style={{width:4,height:4,borderRadius:"50%",background:"#C9A46E"}}/>
        <div style={{width:40,height:0.5,background:"rgba(201,164,110,0.6)"}}/>
      </div>

      {/* Subtítulo */}
      <div style={{fontFamily:"'DM Sans'",fontSize:10,color:"rgba(201,164,110,0.8)",letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:48}}>
        Adega & Memórias
      </div>

      {/* Tagline */}
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",fontWeight:300,color:"rgba(242,237,226,0.75)",lineHeight:1.7}}>
          Sua adega organizada.
        </div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",fontWeight:300,color:"rgba(242,237,226,0.75)",lineHeight:1.7}}>
          Suas memórias eternizadas.
        </div>
      </div>
    </div>

    {/* Botão ENTRAR */}
    <div style={{position:"relative",width:"100%",padding:"0 32px"}}>
      <button onClick={onEntrar} style={{
        width:"100%", padding:"18px",
        background:"#C9A46E", border:"none", borderRadius:50,
        fontFamily:"'DM Sans'",fontSize:12,fontWeight:500,letterSpacing:"0.2em",
        color:"#0D0D0F", textTransform:"uppercase", cursor:"pointer",
      }}>
        ENTRAR
      </button>
    </div>
  </div>
);

// ── Lightbox ───────────────────────────────────────────────────────────────────
const Lightbox = ({ url, onClose }) => {
  if (!url) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"none",border:"none",color:"#F2EDE2",fontSize:32,cursor:"pointer"}}>×</button>
      <img src={cldUrl(url,1400)} onClick={e=>e.stopPropagation()} style={{maxWidth:"95vw",maxHeight:"90vh",objectFit:"contain",borderRadius:4}} />
    </div>
  );
};

// ── Enriquecer vinho com IA ────────────────────────────────────────────────────
const enriquecerVinho = async (w) => {
  const res = await fetch("/api/claude", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:2000,
      messages:[{ role:"user", content:`Você é um sommelier especialista. Para o vinho "${w.name}" do produtor "${w.producer}", região "${w.region}", país "${w.country}", uvas "${w.grapes}", safra ${w.vintage}:
Retorne APENAS JSON válido sem markdown:
{
  "historia": "História do produtor em 3-4 frases sofisticadas em português.",
  "regiao": "Terroir, clima, topografia, ventos, mar/montanhas, solo. 4-5 frases em português.",
  "alcohol": "grau alcoólico como número ex: 14.5",
  "notas": { "aromas":"1-2 linhas", "paladar":"1-2 linhas", "estrutura":"1 linha", "guarda":"1 linha", "harmonizacao":"1 linha" }
}` }]
    })
  });
  const d = await res.json();
  const parsed = JSON.parse(d.content[0].text.replace(/```json|```/g,"").trim());
  return { ...w, ...parsed };
};

const PAIS_COORDS = {
  "África do Sul":{x:530,y:375},"Argentina":{x:265,y:385},"Austrália":{x:820,y:385},
  "Áustria":{x:515,y:170},"Brasil":{x:295,y:335},"Chile":{x:250,y:390},
  "Espanha":{x:458,y:192},"Estados Unidos":{x:170,y:195},"França":{x:473,y:182},
  "Grécia":{x:535,y:198},"Hungria":{x:522,y:172},"Itália":{x:508,y:192},
  "Nova Zelândia":{x:878,y:425},"Portugal":{x:448,y:198},"Alemanha":{x:488,y:168},"Uruguai":{x:282,y:388},
};

// ── Tab Mapa ───────────────────────────────────────────────────────────────────
const TabMapa = ({ wines, onOpenWine }) => {
  const svgRef = useRef(null);
  const [sugestao, setSugestao] = useState(null); // null = não revelado, objeto = vinho sorteado
  const winesAtivos = wines.filter(w=>w.bottles>0);
  const winesDeg = wines.filter(w=>w.bottles===0);
  
  // Agrupa por país
  const porPais = {};
  winesAtivos.forEach(w=>{
    if(!w.country) return;
    if(!porPais[w.country]) porPais[w.country]={rotulos:0,garrafas:0,status:"estoque"};
    porPais[w.country].rotulos+=1;
    porPais[w.country].garrafas+=w.bottles;
  });
  // Países só com memórias (sem estoque ativo)
  winesDeg.forEach(w=>{
    if(!w.country) return;
    if(!porPais[w.country]) porPais[w.country]={rotulos:0,garrafas:0,memorias:1,status:"memoria"};
    else porPais[w.country].memorias=(porPais[w.country].memorias||0)+1;
  });

  const totalGarrafas = winesAtivos.reduce((a,b)=>a+b.bottles,0);
  const totalRotulos = winesAtivos.length;
  const numPaises = Object.keys(porPais).filter(p=>porPais[p].rotulos>0).length;

  // Mapeia nome PT → nome EN do topojson para casar dados
  const nomePtParaEn = {
    "África do Sul":"South Africa","Argentina":"Argentina","Austrália":"Australia","Áustria":"Austria",
    "Brasil":"Brazil","Chile":"Chile","Espanha":"Spain","Estados Unidos":"United States of America",
    "EUA":"United States of America","França":"France","Itália":"Italy","Nova Zelândia":"New Zealand",
    "Portugal":"Portugal","Alemanha":"Germany","Uruguai":"Uruguay","Grécia":"Greece","Hungria":"Hungary",
    "Geórgia":"Georgia","Líbano":"Lebanon","Israel":"Israel","Eslovênia":"Slovenia","Croácia":"Croatia"
  };

  // Lista de países "aspiracionais" (top 10 produtores) para distribuição
  const paisesAspiracionais = ["França","Itália","Espanha","Argentina","Chile","Estados Unidos","Portugal","Alemanha","África do Sul","Austrália"];
  const paisesParaListar = [...new Set([...Object.keys(porPais), ...paisesAspiracionais])];
  const distribuicao = paisesParaListar.map(pais=>{
    const dados = porPais[pais] || {rotulos:0,garrafas:0};
    const pct = totalGarrafas>0 ? Math.round((dados.garrafas/totalGarrafas)*100) : 0;
    return {pais, ...dados, pct};
  }).sort((a,b)=>b.garrafas-a.garrafas);

  // Renderizar mapa com D3, filtrando a Antártida
  useEffect(() => {
    if (!svgRef.current) return;
    if (!window.d3 || !window.topojson) {
      const loadScript = (src) => new Promise((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
        const s = document.createElement("script");
        s.src = src; s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
      Promise.all([
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"),
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js")
      ]).then(()=>renderMap()).catch(e=>console.error("Erro carregando D3",e));
    } else {
      renderMap();
    }

    function renderMap() {
      const d3 = window.d3, topojson = window.topojson;
      const container = svgRef.current;
      if (!container) return;
      container.innerHTML = "";
      const w = container.clientWidth || 360;
      const h = 200;
      const svg = d3.select(container).append("svg").attr("viewBox", `0 0 ${w} ${h}`).attr("width","100%").attr("height",h);
      const projection = d3.geoNaturalEarth1().scale(w/4.6).translate([w/2, h/2 + 4]);
      const path = d3.geoPath(projection);
      d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(world => {
        if (!world) return;
        const todasCountries = topojson.feature(world, world.objects.countries).features;
        // Filtrar Antártida (id 010 ou nome Antarctica)
        const countries = todasCountries.filter(c => c.properties.name !== "Antarctica");
        svg.append("g").selectAll("path").data(countries).join("path")
          .attr("d", path).attr("fill", "#EFE8DA").attr("stroke", "#D6CFC4").attr("stroke-width", 0.4);
        countries.forEach(c => {
          const paisPt = Object.keys(nomePtParaEn).find(pt => nomePtParaEn[pt] === c.properties.name);
          if (!paisPt) return;
          const dados = porPais[paisPt];
          if (!dados || (!dados.garrafas && !dados.memorias)) return;
          const [x, y] = path.centroid(c);
          const cor = (dados.garrafas > 0) ? "#C9A46E" : "#7A5C3A";
          const valor = dados.garrafas || dados.memorias || 0;
          svg.append("circle").attr("cx", x).attr("cy", y).attr("r", 16).attr("fill","none").attr("stroke", cor).attr("stroke-width", 0.6).attr("opacity", 0.4);
          svg.append("circle").attr("cx", x).attr("cy", y).attr("r", 12).attr("fill", cor).attr("opacity", 0.95);
          svg.append("text").attr("x", x).attr("y", y + 3.5).attr("text-anchor","middle").attr("font-family","Cormorant Garamond, serif").attr("font-size", 11).attr("font-weight", 500).attr("fill", "#FFFFFF").text(valor);
        });
      }).catch(e => console.error("Erro carregando mapa", e));
    }
  }, [wines]);

  const sortear = () => {
    if (winesAtivos.length === 0) return;
    const idx = Math.floor(Math.random() * winesAtivos.length);
    setSugestao(winesAtivos[idx]);
  };

  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      <div style={{padding:"32px 24px 14px"}}>
        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6}}>JORNADA</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:300,color:C.text,lineHeight:1}}>Mapa <span style={{color:C.muted,fontSize:22,fontStyle:"italic"}}>da adega</span></div>
        <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginTop:6}}>{totalRotulos} rótulos · {numPaises} {numPaises===1?"país explorado":"países explorados"}</div>
      </div>

      {/* Mapa-mundi de borda a borda */}
      <div style={{padding:"4px 0 12px"}}>
        <div style={{background:C.card,padding:"14px 0 10px",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
          <div ref={svgRef} style={{width:"100%",minHeight:240}} />
          <div style={{display:"flex",gap:16,justifyContent:"center",paddingTop:6}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:C.gold,display:"inline-block"}} />
              <span style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase"}}>Em estoque</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:C.sepia,display:"inline-block"}} />
              <span style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase"}}>Memória</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sugestão para hoje — compacta */}
      {winesAtivos.length>0&&<div style={{padding:"16px 20px"}}>
        {!sugestao ? (
          <button onClick={sortear} style={{width:"100%",background:C.gold,border:"none",borderRadius:10,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'DM Sans'",fontSize:8,color:"rgba(255,255,255,0.85)",letterSpacing:"0.22em",textTransform:"uppercase",marginBottom:4}}>✦ Sugestão para hoje</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",color:"rgba(255,255,255,0.9)",lineHeight:1.3}}>Toque e descubra</div>
            </div>
            <div style={{background:"rgba(255,255,255,0.18)",borderRadius:6,padding:"9px 16px",flexShrink:0}}>
              <span style={{fontFamily:"'DM Sans'",fontSize:9,color:"#FFFFFF",letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:300,whiteSpace:"nowrap"}}>✦ Revelar</span>
            </div>
          </button>
        ) : (
          <div style={{background:C.gold,borderRadius:10,padding:"16px 18px"}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:8,color:"rgba(255,255,255,0.85)",letterSpacing:"0.22em",textTransform:"uppercase",marginBottom:6}}>✦ Sua adega sugere</div>
            <div onClick={()=>onOpenWine&&onOpenWine(sugestao)} style={{cursor:"pointer"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,color:"#FFFFFF",lineHeight:1.2,marginBottom:3}}>{sugestao.name}</div>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:"rgba(255,255,255,0.92)",letterSpacing:"0.06em",textTransform:"uppercase"}}>{sugestao.country||""} {sugestao.vintage?"· "+sugestao.vintage:""} · você tem {sugestao.bottles}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginTop:14,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.2)"}}>
              <button onClick={sortear} style={{background:"none",border:"none",color:"rgba(255,255,255,0.9)",fontFamily:"'DM Sans'",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:6}}>
                <span>↻</span><span>Sortear outro</span>
              </button>
              <button onClick={()=>onOpenWine&&onOpenWine(sugestao)} style={{background:"none",border:"none",color:"#FFFFFF",fontFamily:"'DM Sans'",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:6,fontWeight:500}}>
                <span>Ver ficha</span><span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>}

      {/* Distribuição por país */}
      <div style={{padding:"4px 24px 24px"}}>
        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>DISTRIBUIÇÃO POR PAÍS</div>
        {distribuicao.map(({pais,rotulos,garrafas,pct})=>{
          const ativo = garrafas > 0;
          return (
            <div key={pais} style={{marginBottom:16,opacity:ativo?1:0.5}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:C.text,fontStyle:ativo?"normal":"italic"}}>{pais}</span>
                <span style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,letterSpacing:"0.06em"}}>
                  {ativo ? `${rotulos} ${rotulos===1?"rótulo":"rótulos"} · ${pct}%` : "— sem rótulos"}
                </span>
              </div>
              <div style={{height:2,background:"rgba(201,164,110,0.12)",borderRadius:2,overflow:"hidden"}}>
                {ativo && <div style={{height:"100%",width:`${pct}%`,background:C.gold}} />}
              </div>
            </div>
          );
        })}
        {numPaises>=2 && numPaises<=4 && (
          <div style={{marginTop:24,padding:"14px 16px",background:"rgba(122,92,58,0.06)",borderLeft:`2px solid ${C.sepia}`}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",color:C.sub,lineHeight:1.5}}>"Sua jornada está começando a se desdobrar pelo mundo."</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Tab Memórias ───────────────────────────────────────────────────────────────
const TabMemorias = ({ wines }) => {
  const [detail, setDetail] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const top20 = [...wines].filter(w=>w.memory&&w.rating>0).sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,20);

  if (detail) {
    const w = detail;
    return (
      <div style={{position:"fixed",inset:0,background:C.bg,zIndex:50,overflowY:"auto"}}>
        <Lightbox url={lightbox} onClose={()=>setLightbox(null)} />
        <div style={{position:"sticky",top:0,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"16px 24px",zIndex:10}}>
          <button onClick={()=>setDetail(null)} style={{background:"none",border:"none",fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.12em",color:C.muted,cursor:"pointer",padding:0}}>← MEMÓRIAS</button>
        </div>
        <div style={{padding:"32px 24px 80px"}}>
          {w.photos?.length>0&&(
            <div style={{margin:"0 -24px 28px",overflowX:"auto",overflowY:"hidden",WebkitOverflowScrolling:"touch",scrollSnapType:"x mandatory"}}>
              <div style={{display:"flex",gap:10,padding:"0 24px"}}>
                {w.photos.map((p,i)=>(
                  <img key={i} src={cldUrl(p,800)} loading="lazy" onClick={()=>setLightbox(p)} style={{height:240,minWidth:w.photos.length===1?"100%":"75%",objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`,cursor:"zoom-in",scrollSnapAlign:"start",flexShrink:0}} />
                ))}
              </div>
              {w.photos.length>1&&(
                <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:10}}>
                  {w.photos.map((_,i)=>(
                    <span key={i} style={{width:5,height:5,borderRadius:"50%",background:i===0?C.gold:"rgba(125,98,56,0.25)",display:"inline-block"}} />
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:8}}>
            <span style={{fontSize:22}}>❤️</span>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:300,color:C.goldD,lineHeight:1}}>{w.rating}</span>
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:300,color:C.text,marginBottom:4}}>{w.name}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,marginBottom:20}}>{w.producer} · {w.vintage}</div>
          {w.location&&<div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:24}}>📍 {w.location} · {w.date}</div>}
          <div style={{background:C.card,borderRadius:8,padding:"22px",border:`1px solid ${C.border}`}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>MEMÓRIA</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",color:C.sub,lineHeight:1.85}}>"{w.memory}"</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      <div style={{padding:"32px 24px 0",marginBottom:24}}>
        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6}}>MEMÓRIAS</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,color:C.text}}>Top <span style={{color:C.muted}}>experiências</span></div>
        <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginTop:4}}>As {top20.length} maiores emoções da adega</div>
      </div>
      <div style={{padding:"0 24px"}}>
        {top20.length===0?(
          <div style={{textAlign:"center",padding:"72px 0"}}>
            <div style={{fontSize:32,marginBottom:16,opacity:0.3}}>❤️</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",color:C.muted,lineHeight:1.6}}>Suas memórias vinícolas<br/>aparecerão aqui</div>
          </div>
        ):top20.map((w,i)=>(
          <div key={w.id} onClick={()=>setDetail(w)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:10,cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"stretch"}}>
            <div style={{width:54,background:i===0?C.goldD:i===1?"#7A6030":i===2?C.sepia:C.card2,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,flexShrink:0}}>
              <span style={{fontFamily:"'DM Sans'",fontSize:10,color:i<3?"#fff":C.muted,fontWeight:500}}>#{i+1}</span>
              <span style={{fontSize:13}}>❤️</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:400,color:i<3?"#fff":C.goldD}}>{w.rating}</span>
            </div>
            <div style={{flex:1,padding:"14px 16px",minWidth:0}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:C.text,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.name}</div>
              <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:8}}>{w.producer} · {w.vintage}</div>
              {w.memory&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",color:C.sub,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>"{w.memory}"</div>}
              {w.location&&<div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,marginTop:6}}>📍 {w.location}</div>}
            </div>
            {w.photos?.[0]&&<img src={cldUrl(w.photos[0],128)} loading="lazy" style={{width:64,objectFit:"cover",flexShrink:0}} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Photo Uploader ─────────────────────────────────────────────────────────────
const PhotoUploader = ({ photos, onChange, max=5 }) => {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const handle = async e => {
    const file = e.target.files[0]; if (!file) return;
    setBusy(true);
    try { onChange([...photos, await uploadToCloudinary(file)].slice(0,max)); }
    catch {}
    setBusy(false); e.target.value="";
  };
  return (
    <div style={{marginBottom:24}}>
      <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10}}>FOTOS</div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {photos.map((url,i)=>(
          <div key={i} style={{position:"relative"}}>
            <img src={cldUrl(url,180)} loading="lazy" style={{width:88,height:118,objectFit:"cover",borderRadius:4,border:`1px solid ${C.border}`}} />
            <button onClick={()=>onChange(photos.filter((_,j)=>j!==i))} style={{position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:C.wine,border:`2px solid ${C.bg}`,color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        ))}
        {photos.length<max&&(
          <div onClick={()=>!busy&&ref.current.click()} style={{width:88,height:118,border:`1px dashed ${busy?C.gold:C.border}`,borderRadius:4,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:6,background:busy?C.goldL:"transparent"}}>
            <span style={{fontSize:22,opacity:0.4}}>{busy?"...":"📷"}</span>
            <span style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted}}>{busy?"ENVIANDO":"FOTO"}</span>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={handle} style={{display:"none"}} />
    </div>
  );
};

const Qty = ({ value, onChange, accent }) => (
  <div style={{display:"flex",alignItems:"center",background:C.card2,borderRadius:6,border:`1px solid ${C.border}`,overflow:"hidden"}}>
    <button onClick={e=>{e.stopPropagation();onChange(Math.max(0,value-1));}} style={{width:36,height:36,border:"none",background:"none",cursor:"pointer",fontSize:18,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,color:accent||C.goldD,minWidth:30,textAlign:"center"}}>{value}</span>
    <button onClick={e=>{e.stopPropagation();onChange(value+1);}} style={{width:36,height:36,border:"none",background:"none",cursor:"pointer",fontSize:18,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
  </div>
);

// ── Texto editorial truncado em 3 linhas com "... ler mais" inline ───────────
const TextoTruncavel = ({ texto, linhas=3, fontSize=17, lineHeight=1.85 }) => {
  const [expandido, setExpandido] = useState(false);
  const ref = useRef(null);
  const [precisaTruncar, setPrecisaTruncar] = useState(false);

  useEffect(()=>{
    if (!ref.current) return;
    // Verifica se o texto tem mais linhas do que o limite
    const el = ref.current;
    // Mede altura real vs altura de N linhas
    const lineHeightPx = parseFloat(getComputedStyle(el).lineHeight);
    const alturaLimite = lineHeightPx * linhas;
    setPrecisaTruncar(el.scrollHeight > alturaLimite + 2);
  }, [texto, linhas]);

  if (!texto) return null;

  return (
    <div>
      <div
        ref={ref}
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize,
          fontStyle: "italic",
          color: C.sub,
          lineHeight,
          overflow: "hidden",
          display: (precisaTruncar && !expandido) ? "-webkit-box" : "block",
          WebkitLineClamp: (precisaTruncar && !expandido) ? linhas : "unset",
          WebkitBoxOrient: "vertical",
          transition: "all 0.3s ease",
        }}
      >
        {texto}
      </div>
      {precisaTruncar && (
        <div style={{marginTop:6}}>
          <button
            onClick={()=>setExpandido(e=>!e)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: fontSize - 2,
              fontStyle: "italic",
              color: C.goldD,
              opacity: 0.85,
            }}
          >
            {expandido ? "ler menos" : "… ler mais"}
          </button>
        </div>
      )}
    </div>
  );
};

const NotasTopicos = ({ notas }) => {
  if (!notas) return null;
  let topicos = null;
  try { topicos = typeof notas==="object"?notas:JSON.parse(notas); } catch {}
  const labels = { aromas:"🌸 Aromas", paladar:"👄 Paladar", estrutura:"⚖️ Estrutura", guarda:"⏳ Guarda", harmonizacao:"🍽️ Harmonização" };
  if (topicos && typeof topicos==="object") {
    return (
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {Object.entries(topicos).map(([k,v])=>v?(
          <div key={k} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{fontFamily:"'DM Sans'",fontSize:10,color:C.goldD,letterSpacing:"0.06em",minWidth:90,paddingTop:2,flexShrink:0}}>{labels[k]||k}</span>
            <div style={{flex:1,minWidth:0}}>
              <TextoTruncavel texto={v} linhas={2} fontSize={16} lineHeight={1.65} />
            </div>
          </div>
        ):null)}
      </div>
    );
  }
  return <TextoTruncavel texto={notas} />;
};

const VoiceButton = ({ onResult }) => {
  const [ouvindo, setOuvindo] = useState(false);
  const recRef = useRef(null);
  const toggle = () => {
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    if (!SR) return;
    if (ouvindo) { recRef.current?.stop(); setOuvindo(false); return; }
    const rec = new SR();
    rec.lang="pt-BR"; rec.interimResults=false; rec.maxAlternatives=1;
    rec.onresult=e=>{onResult(e.results[0][0].transcript);setOuvindo(false);};
    rec.onerror=()=>setOuvindo(false); rec.onend=()=>setOuvindo(false);
    recRef.current=rec; rec.start(); setOuvindo(true);
  };
  return (
    <button onClick={toggle} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${ouvindo?C.goldD:C.border}`,background:ouvindo?C.goldL:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontSize:15}}>{ouvindo?"⏹":"🎙️"}</span>
    </button>
  );
};

// ── Wine Detail ────────────────────────────────────────────────────────────────

// ── Sommelier — modal de pergunta livre + IA classifica em qual seção adicionar ──
const SommelierModal = ({ wine, onClose, onUpdate }) => {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [secaoSugerida, setSecaoSugerida] = useState(null); // "historia"|"regiao"|"notas"
  const [loading, setLoading] = useState(false);
  const [adicionando, setAdicionando] = useState(false);
  const [adicionado, setAdicionado] = useState(false);

  const perguntar = async () => {
    if (!pergunta.trim()) return;
    setLoading(true);
    setResposta("");
    setSecaoSugerida(null);
    setAdicionado(false);
    try {
      const r = await fetch("/api/claude", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: `Você é um sommelier sofisticado e culto. O usuário tem o seguinte vinho na adega:

Nome: "${wine.name}"
Produtor: "${wine.producer}"
Safra: ${wine.vintage}
Região: ${wine.region||"não informada"}
País: ${wine.country||"não informado"}
Tipo: ${wine.style||"não informado"}

Pergunta do usuário: "${pergunta}"

Responda à pergunta de forma elegante, culta e em português brasileiro, em 3-6 frases. Use linguagem editorial, sofisticada, sem clichês. Não use listas nem markdown.

Depois da sua resposta, em uma linha separada no FINAL, classifique em qual seção da ficha do vinho a resposta deveria ser adicionada caso o usuário queira:
- "historia" se for sobre o produtor/vinícola/família/filosofia
- "regiao" se for sobre região/terroir/clima/solo
- "notas" se for sobre aromas/paladar/harmonização/guarda

Formato OBRIGATÓRIO da resposta:
[texto da resposta em prosa, 3-6 frases]

##SECAO## [historia|regiao|notas]`
          }]
        })
      });
      const data = await r.json();
      const txt = data.content?.[0]?.text || "";
      const partes = txt.split(/##SECAO##/i);
      const respostaTexto = partes[0].trim();
      const secao = (partes[1]||"").trim().toLowerCase().replace(/[^a-z]/g,"");
      const secaoValida = ["historia","regiao","notas"].includes(secao) ? secao : "historia";
      setResposta(respostaTexto);
      setSecaoSugerida(secaoValida);
    } catch(e) {
      console.error(e);
      setResposta("Não foi possível obter resposta. Tente novamente.");
    }
    setLoading(false);
  };

  const adicionar = () => {
    if (!resposta || !secaoSugerida) return;
    setAdicionando(true);
    if (secaoSugerida === "notas") {
      // Adiciona à harmonização ou paladar como linha extra
      const notasObj = (typeof wine.notas === "object" && wine.notas) ? wine.notas : {aromas:"",paladar:"",estrutura:"",guarda:"",harmonizacao:""};
      notasObj.harmonizacao = (notasObj.harmonizacao ? notasObj.harmonizacao + " — " : "") + resposta;
      onUpdate({...wine, notas: notasObj});
    } else {
      const textoAtual = wine[secaoSugerida] || "";
      const novo = textoAtual ? textoAtual + "\n\n" + resposta : resposta;
      onUpdate({...wine, [secaoSugerida]: novo});
    }
    setAdicionado(true);
    setTimeout(()=>setAdicionando(false), 400);
  };

  const novaPergunta = () => {
    setPergunta("");
    setResposta("");
    setSecaoSugerida(null);
    setAdicionado(false);
  };

  const labelSecao = secaoSugerida === "historia" ? "O Produtor" : secaoSugerida === "regiao" ? "A Região" : "O Vinho";

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(13,13,15,0.65)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.bg,borderTopLeftRadius:20,borderTopRightRadius:20,width:"100%",maxWidth:430,maxHeight:"85vh",overflowY:"auto",padding:"28px 24px calc(24px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 32px rgba(0,0,0,0.18)"}}>
        
        {/* Cabeçalho */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <IconeKV nome="adega" cor={C.gold} tamanho={22} />
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:300,color:C.text,letterSpacing:"0.04em"}}>Sommelier</span>
        </div>
        <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:24}}>{wine.name}{wine.vintage?` · ${wine.vintage}`:""}</div>

        {!resposta && !loading && (
          <>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.sub,marginBottom:14,lineHeight:1.5}}>
              O que você gostaria de saber?
            </div>
            <textarea
              value={pergunta}
              onChange={e=>setPergunta(e.target.value)}
              placeholder='ex: O que significa o nome desta vinícola? Com que pratos harmoniza?'
              autoFocus
              rows={4}
              style={{width:"100%",padding:"14px 16px",background:C.card,border:`1px solid rgba(201,164,110,0.3)`,borderRadius:8,fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:C.text,outline:"none",resize:"vertical",boxSizing:"border-box",fontStyle:"italic",lineHeight:1.5}}
            />
            <button onClick={perguntar} disabled={!pergunta.trim()} style={{width:"100%",background:pergunta.trim()?C.gold:C.muted,opacity:pergunta.trim()?1:0.4,border:"none",borderRadius:8,padding:"15px",marginTop:14,cursor:pergunta.trim()?"pointer":"default",fontFamily:"'DM Sans'",fontSize:11,color:"#FFFFFF",letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:300}}>
              Perguntar
            </button>
          </>
        )}

        {loading && (
          <div style={{padding:"40px 0",textAlign:"center"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.muted}}>Consultando o sommelier...</div>
          </div>
        )}

        {resposta && !loading && (
          <>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:8}}>Você perguntou</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontStyle:"italic",color:C.text,marginBottom:18,paddingLeft:12,borderLeft:`2px solid ${C.gold}`,lineHeight:1.4}}>{pergunta}</div>
            
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:8}}>Resposta</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.7,marginBottom:24,whiteSpace:"pre-wrap"}}>{resposta}</div>

            {!adicionado && (
              <button onClick={adicionar} disabled={adicionando} style={{width:"100%",background:C.gold,border:"none",borderRadius:8,padding:"14px",marginBottom:8,cursor:"pointer",fontFamily:"'DM Sans'",fontSize:10,color:"#FFFFFF",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:300,opacity:adicionando?0.6:1}}>
                {adicionando ? "Adicionando..." : `✦ Adicionar a "${labelSecao}"`}
              </button>
            )}
            {adicionado && (
              <div style={{padding:"12px",background:"rgba(42,96,64,0.1)",borderRadius:8,marginBottom:8,textAlign:"center"}}>
                <span style={{fontFamily:"'DM Sans'",fontSize:10,color:C.green,letterSpacing:"0.18em",textTransform:"uppercase"}}>✓ Adicionado à ficha</span>
              </div>
            )}

            <button onClick={novaPergunta} style={{width:"100%",background:"none",border:`1px solid rgba(201,164,110,0.6)`,borderRadius:8,padding:"12px",marginBottom:6,cursor:"pointer",fontFamily:"'DM Sans'",fontSize:10,color:C.goldD,letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:300}}>
              Fazer outra pergunta
            </button>
          </>
        )}

        <button onClick={onClose} style={{width:"100%",background:"none",border:"none",padding:"12px",cursor:"pointer",fontFamily:"'DM Sans'",fontSize:10,color:C.muted,letterSpacing:"0.18em",textTransform:"uppercase",marginTop:6}}>
          Fechar
        </button>
      </div>
    </div>
  );
};

const WineDetail = ({ w, onBack, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState({...w});
  const [aiPrompt, setAiPrompt] = useState("");
  const [aibusy, setAiBusy] = useState(false);
  const [aiMsg, setAiMsg] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [completando, setCompletando] = useState(false);
  const [sommelierAberto, setSommelierAberto] = useState(false);

  // Verifica se a ficha está incompleta (falta produtor, região ou notas)
  const fichaIncompleta = !w.historia || !w.regiao || !w.notas || (typeof w.notas==="object" && !Object.values(w.notas||{}).some(v=>v));

  const completarFicha = async () => {
    setCompletando(true);
    try {
      const enriquecido = await enriquecerVinho(w);
      onUpdate(enriquecido);
    } catch(e) { alert("Não foi possível completar a ficha. Tente novamente."); }
    setCompletando(false);
  };

  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const save = () => { onUpdate(f); setEditing(false); setAiPrompt(""); setAiMsg(""); };
  const isDeg = w.bottles===0;
  const accent = isDeg?C.sepia:C.goldD;

  const corrigirIA = async () => {
    if (!aiPrompt.trim()) return;
    setAiBusy(true); setAiMsg("Corrigindo...");
    try {
      const res = await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,
          messages:[{role:"user",content:`Sommelier especialista. Vinho: "${f.name}", produtor: "${f.producer}", safra: ${f.vintage}, região: "${f.region}", país: "${f.country}".
Corrija: "${aiPrompt}"
Retorne APENAS JSON com campos alterados: { "region","country","grapes","style","alcohol","historia","regiao","notas":{...} }`}]})});
      const d = await res.json();
      const parsed = JSON.parse(d.content[0].text.replace(/```json|```/g,"").trim());
      setF(p=>({...p,...parsed})); setAiMsg("✓ Corrigido. Revise e salve.");
    } catch(e) { setAiMsg("Erro: "+e.message); }
    setAiBusy(false);
  };

  const notasObj = (typeof f.notas==="object"&&f.notas)?f.notas:{aromas:"",paladar:"",estrutura:"",guarda:"",harmonizacao:""};
  const labelsN = {aromas:"🌸 Aromas",paladar:"👄 Paladar",estrutura:"⚖️ Estrutura",guarda:"⏳ Guarda",harmonizacao:"🍽️ Harmonização"};

  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:50,overflowY:"auto"}}>
      <Lightbox url={lightbox} onClose={()=>setLightbox(null)} />
      <div style={{position:"sticky",top:0,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.12em",color:C.muted,cursor:"pointer",padding:0}}>← ADEGA</button>
        {editing && <button onClick={save} style={{background:C.goldD,border:`1px solid ${C.goldD}`,borderRadius:4,padding:"7px 18px",fontFamily:"'DM Sans'",fontSize:10,letterSpacing:"0.1em",color:"#fff",cursor:"pointer"}}>SALVAR</button>}
        {!editing&&<button onClick={()=>{if(window.confirm("Remover este vinho?"))onDelete(w.id);}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:4,padding:"7px 14px",fontFamily:"'DM Sans'",fontSize:11,color:C.muted,cursor:"pointer"}}>🗑</button>}
      </div>
      <div style={{padding:"32px 24px 100px"}}>
        {!editing&&fichaIncompleta&&(
          <button onClick={completarFicha} disabled={completando} style={{width:"100%",padding:"12px 14px",marginBottom:20,background:C.goldL,border:`1px solid ${C.gold}`,borderRadius:6,color:C.goldD,fontFamily:"'DM Sans'",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",cursor:completando?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:completando?0.6:1}}>
            <span>✦</span><span>{completando?"Completando...":"Completar ficha com IA"}</span>
          </button>
        )}
        {isDeg&&(
          <div style={{background:C.sepiaL,border:`1px solid rgba(122,92,58,0.2)`,borderRadius:6,padding:"10px 16px",marginBottom:24,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:14}}>🍷</span>
            <span style={{fontFamily:"'DM Sans'",fontSize:10,color:C.sepia,letterSpacing:"0.1em",textTransform:"uppercase"}}>Degustado · Memória preservada</span>
          </div>
        )}
        {editing?<PhotoUploader photos={f.photos||[]} onChange={v=>set("photos",v)} />
          :f.photos?.length>0&&(
            <div style={{display:"flex",gap:12,marginBottom:32}}>
              {f.photos.map((url,i)=><img key={i} src={cldUrl(url,260)} loading="lazy" onClick={()=>setLightbox(url)} style={{width:128,height:170,objectFit:"cover",borderRadius:6,border:`1px solid ${C.border}`,filter:isDeg?"sepia(40%)":"none",cursor:"zoom-in"}} />)}
            </div>
          )
        }
        <div style={{width:24,height:1,background:C.gold,marginBottom:24,opacity:0.4}} />
        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:8}}>{w.style} · {w.country}</div>
        {editing?<input value={f.name} onChange={e=>set("name",e.target.value)} style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:300,color:C.text,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none",marginBottom:8,boxSizing:"border-box"}} />
          :<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,color:C.text,lineHeight:1.1,marginBottom:6}}>{w.name}</div>}
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.sub,marginBottom:32}}>{w.producer}, {w.vintage}</div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:26}}>❤️</span>
            {editing?<input type="number" min={0} max={100} value={f.rating} onChange={e=>set("rating",+e.target.value)} style={{width:72,fontFamily:"'Cormorant Garamond',serif",fontSize:56,fontWeight:300,color:accent,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none"}} />
              :<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:64,color:accent,fontWeight:300,lineHeight:1}}>{w.rating}</div>}
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>GARRAFAS</div>
            <Qty value={editing?f.bottles:w.bottles} onChange={v=>{set("bottles",v);if(!editing)onUpdate({...w,bottles:v});}} accent={accent} />
          </div>
        </div>

        {editing&&<div style={{marginBottom:28}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>❤️ EMOÇÃO — {f.rating}</div>
          <input type="range" min={0} max={100} value={f.rating} onChange={e=>set("rating",+e.target.value)} style={{width:"100%",accentColor:C.goldD}} />
        </div>}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:32,borderRadius:4,overflow:"hidden"}}>
          {[["REGIÃO","region"],["PAÍS","country"],["UVAS","grapes"],["ADQUIRIDO","date"],["ÁLCOOL","alcohol"]].map(([l,k])=>(
            <div key={k} style={{background:C.card,padding:"14px 16px"}}>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:5}}>{l}</div>
              {editing?<input value={f[k]||""} onChange={e=>set(k,e.target.value)} placeholder={k==="alcohol"?"ex: 14.5":""} style={{width:"100%",fontFamily:"'DM Sans'",fontSize:13,color:C.text,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none",boxSizing:"border-box"}} />
                :<div style={{fontFamily:"'DM Sans'",fontSize:13,color:C.sub}}>{w[k]}{k==="alcohol"&&w[k]&&!String(w[k]).includes("%")?"%":""}</div>}
            </div>
          ))}
        </div>

        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:14}}>MINHA MEMÓRIA</div>
        {editing?<div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
            <textarea value={f.memory||""} onChange={e=>set("memory",e.target.value)} rows={4} placeholder="Onde estava, com quem, o que sentiu..." style={{flex:1,fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.text,border:`1px solid ${C.border}`,borderRadius:4,background:C.card,outline:"none",padding:14,resize:"none",lineHeight:1.8,boxSizing:"border-box"}} />
            <VoiceButton onResult={txt=>set("memory",(f.memory?f.memory+" ":"")+txt)} />
          </div>
          :w.memory&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",color:C.sub,lineHeight:1.85,marginBottom:8}}>"{w.memory}"</div>}
        {w.location&&<div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginTop:8,marginBottom:32}}>📍 {w.location}</div>}

        {(editing||w.historia)&&<div style={{marginBottom:16,padding:"20px",background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.goldD,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:12}}>O PRODUTOR</div>
          {editing?<textarea value={f.historia||""} onChange={e=>set("historia",e.target.value)} rows={4} style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.text,border:`1px solid ${C.border}`,borderRadius:4,background:C.card2,outline:"none",padding:10,resize:"none",lineHeight:1.8,boxSizing:"border-box"}} />
            :<TextoTruncavel texto={w.historia} />}
        </div>}

        {(editing||w.regiao)&&<div style={{marginBottom:16,padding:"20px",background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.green,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:12}}>A REGIÃO</div>
          {editing?<textarea value={f.regiao||""} onChange={e=>set("regiao",e.target.value)} rows={4} placeholder="Terroir, clima, topografia..." style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.text,border:`1px solid ${C.border}`,borderRadius:4,background:C.card2,outline:"none",padding:10,resize:"none",lineHeight:1.8,boxSizing:"border-box"}} />
            :<TextoTruncavel texto={w.regiao} />}
        </div>}

        {(editing||w.notas)&&<div style={{marginBottom:16,padding:"20px",background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.wine,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:14}}>O VINHO</div>
          {editing?<div style={{display:"flex",flexDirection:"column",gap:14}}>
              {Object.keys(labelsN).map(k=>(
                <div key={k}>
                  <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>{labelsN[k]}</div>
                  <input value={notasObj[k]||""} onChange={e=>set("notas",{...notasObj,[k]:e.target.value})} style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:C.text,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none",boxSizing:"border-box",paddingBottom:4}} />
                </div>
              ))}
            </div>
            :<NotasTopicos notas={w.notas} />}
        </div>}

        {/* AÇÕES NO RODAPÉ — Pergunte ao Sommelier + Editar Ficha (modo visualização) */}
        {!editing && (
          <div style={{marginTop:32,paddingTop:24,borderTop:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={()=>setSommelierAberto(true)} style={{width:"100%",background:C.gold,border:"none",borderRadius:8,padding:"18px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              <span style={{color:"#FFFFFF",fontSize:14,opacity:0.95}}>✦</span>
              <span style={{fontFamily:"'DM Sans'",fontSize:11,fontWeight:300,color:"#FFFFFF",letterSpacing:"0.22em",textTransform:"uppercase"}}>Pergunte ao sommelier</span>
            </button>
            <button onClick={()=>setEditing(true)} style={{width:"100%",background:"transparent",border:`1px solid rgba(201,164,110,0.6)`,borderRadius:8,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              <span style={{fontFamily:"'DM Sans'",fontSize:10,fontWeight:300,color:C.goldD,letterSpacing:"0.22em",textTransform:"uppercase"}}>Editar ficha</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal Sommelier */}
      {sommelierAberto && <SommelierModal wine={w} onClose={()=>setSommelierAberto(false)} onUpdate={onUpdate} />}
    </div>
  );
};

// ── Add Wine ───────────────────────────────────────────────────────────────────
const AddWine = ({ onClose, onSave }) => {
  const [f, setF] = useState({name:"",producer:"",vintage:2024,region:"",country:"África do Sul",grapes:"",style:"Tinto",bottles:1,rating:50,memory:"",location:"",accent:C.goldD,special:false,photos:[],historia:"",regiao:"",alcohol:"",notas:null});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({msg:"",ok:false});
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const enrich = async () => {
    if(!f.name||!f.producer) return;
    setBusy(true); setStatus({msg:"Pesquisando vinho e produtor...",ok:false});
    try {
      const res = await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,
          messages:[{role:"user",content:`Sommelier especialista. Vinho "${f.name}", produtor "${f.producer}", safra ${f.vintage}. Retorne APENAS JSON:
{ "region":"região vinícola", "country":"país em português", "grapes":"uvas", "style":"Tinto|Branco|Rose|Espumante|Sobremesa", "alcohol":"número ex:14.5", "historia":"3-4 frases sofisticadas sobre o produtor", "regiao":"4-5 frases sobre terroir, clima, topografia, ventos, mar/montanhas", "notas":{"aromas":"","paladar":"","estrutura":"","guarda":"","harmonizacao":""} }`}]})});
      const d = await res.json();
      if(d.error){setStatus({msg:"Erro",ok:false});setBusy(false);return;}
      const parsed = JSON.parse(d.content[0].text.replace(/```json|```/g,"").trim());
      setF(p=>({...p,...parsed}));
      setStatus({msg:"Ficha completa. Adicione sua memória.",ok:true});
    } catch(e){setStatus({msg:"Erro: "+(e.message||""),ok:false});}
    setBusy(false);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(26,20,16,0.6)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div style={{background:C.card,borderRadius:"16px 16px 0 0",padding:"28px 24px 52px",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{width:32,height:2,background:C.border,borderRadius:1,margin:"0 auto 28px"}} />
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:C.text,marginBottom:4}}>Registrar vinho</div>
        <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:28}}>Foto + nome + produtor — a IA completa a ficha.</div>
        <PhotoUploader photos={f.photos} onChange={v=>set("photos",v)} />

        {[["Nome do Vinho","name","text","ex: Paul Sauer"],["Produtor","producer","text","ex: Kanonkop"],["Safra","vintage","number",""]].map(([l,k,t,ph])=>(
          <div key={k} style={{marginBottom:18}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:8}}>{l}</div>
            <input type={t} value={f[k]} placeholder={ph} onChange={e=>set(k,t==="number"?+e.target.value:e.target.value)} style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,borderRadius:4,padding:"12px 14px",color:C.text,fontFamily:"'DM Sans'",fontSize:14,outline:"none",boxSizing:"border-box"}} />
          </div>
        ))}

        <button onClick={enrich} disabled={busy||!f.name||!f.producer} style={{width:"100%",padding:"16px 18px",marginBottom:18,background:status.ok?"#1F4A30":(!f.name||!f.producer)?"#B8A584":"#C9A46E",border:"none",borderRadius:8,color:"#FFFFFF",fontFamily:"'DM Sans', sans-serif",fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",cursor:(!f.name||!f.producer)?"default":"pointer",fontWeight:500}}>
          {busy?"✦ Pesquisando...":status.ok?"✓ Ficha gerada":"✦ Gerar ficha com IA"}
        </button>

        {status.msg&&<div style={{fontFamily:"'DM Sans'",fontSize:11,color:status.ok?C.green:C.goldD,background:status.ok?C.greenL:C.goldL,padding:"10px 14px",borderRadius:4,marginBottom:18}}>{status.msg}</div>}

        {f.historia&&<div style={{marginBottom:16,padding:"18px",background:C.card2,borderRadius:6,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.goldD,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10}}>O PRODUTOR</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.8}}>{f.historia}</div>
        </div>}

        {f.regiao&&<div style={{marginBottom:16,padding:"18px",background:C.card2,borderRadius:6,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.green,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10}}>A REGIÃO</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.8}}>{f.regiao}</div>
        </div>}

        {f.notas&&<div style={{marginBottom:16,padding:"18px",background:C.card2,borderRadius:6,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.wine,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:12}}>O VINHO</div>
          <NotasTopicos notas={f.notas} />
        </div>}

        {status.ok&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:18,borderRadius:4,overflow:"hidden"}}>
          {[["REGIÃO",f.region],["PAÍS",f.country],["UVAS",f.grapes],["ESTILO",f.style],["ÁLCOOL",f.alcohol?f.alcohol+"%":""]].map(([l,v])=>(
            <div key={l} style={{background:C.card,padding:"12px 14px"}}>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>{l}</div>
              <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.sub}}>{v}</div>
            </div>
          ))}
        </div>}

        <div style={{marginBottom:18}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10}}>GARRAFAS</div>
          <Qty value={f.bottles} onChange={v=>set("bottles",v)} accent={C.goldD} />
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:8}}>❤️ EMOÇÃO — {f.rating}</div>
          <input type="range" min={0} max={100} value={f.rating} onChange={e=>set("rating",+e.target.value)} style={{width:"100%",accentColor:C.goldD}} />
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:8}}>MINHA MEMÓRIA</div>
          <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <textarea value={f.memory} onChange={e=>set("memory",e.target.value)} rows={3} placeholder="Onde estava, com quem, o que sentiu..." style={{flex:1,background:C.card2,border:`1px solid ${C.border}`,borderRadius:4,padding:"12px 14px",color:C.text,fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",outline:"none",resize:"none",boxSizing:"border-box",lineHeight:1.7}} />
            <VoiceButton onResult={txt=>set("memory",(f.memory?f.memory+" ":"")+txt)} />
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:8}}>LOCAL</div>
          <input value={f.location} onChange={e=>set("location",e.target.value)} placeholder="ex: Kanonkop, Stellenbosch" style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,borderRadius:4,padding:"12px 14px",color:C.text,fontFamily:"'DM Sans'",fontSize:14,outline:"none",boxSizing:"border-box"}} />
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28,cursor:"pointer"}} onClick={()=>set("special",!f.special)}>
          <div style={{width:22,height:22,border:`1px solid ${f.special?C.goldD:C.border}`,borderRadius:3,background:f.special?C.goldL:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:f.special?C.gold:"rgba(125,98,56,0.4)",fontSize:14,lineHeight:1}}>{f.special?"★":"☆"}</span>
          </div>
          <span style={{fontFamily:"'DM Sans'",fontSize:12,color:C.sub}}>Vinho especial</span>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:14,background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.1em",cursor:"pointer"}}>CANCELAR</button>
          <button onClick={()=>{if(!f.name)return;onSave({...f,id:Date.now(),date:new Date().toLocaleDateString("pt-BR",{month:"short",year:"numeric"})});}} style={{flex:2,padding:14,background:C.goldD,border:"none",borderRadius:6,color:"#fff",fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontWeight:500}}>
            ADICIONAR À ADEGA
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Tab Adega ──────────────────────────────────────────────────────────────────
const TabAdega = ({ wines, setWines, vinhoParaAbrir, onAbriu }) => {
  const [detail, setDetail] = useState(null);
  
  // Quando o Mapa pede para abrir um vinho específico, abre direto na ficha
  useEffect(()=>{
    if (vinhoParaAbrir) {
      setDetail(vinhoParaAbrir);
      if (onAbriu) onAbriu();
    }
  }, [vinhoParaAbrir]);
  const [adding, setAdding] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState(null);
  const [search, setSearch] = useState("");
  const update = u => setWines(ws=>ws.map(w=>w.id===u.id?u:w));
  const remove = (id, nome) => {
    if(window.confirm(`Remover "${nome}" da adega?`)){
      setWines(ws=>ws.filter(w=>w.id!==id));
    }
  };

  const tipos = ["Tinto","Branco","Rose","Espumante","Sobremesa"];
  const winesAtivos = wines.filter(w=>w.bottles>0);
  const winesDegustados = wines.filter(w=>w.bottles===0);

  const filtroCasta = winesAtivos.reduce((acc,w)=>{
    const cf=getCastaFiltro(w.grapes);
    if(cf&&!acc.includes(cf))acc.push(cf); return acc;
  },[]).sort((a,b)=>a==="Blend"?-1:b==="Blend"?1:a.localeCompare(b));

  const filtrosPais = [...new Set(winesAtivos.map(w=>w.country).filter(Boolean))].sort();

  const winesFiltrados = (()=>{
    if (!filtroAtivo) return [];
    if (filtroAtivo==="Degustados") return winesDegustados.filter(w=>{const q=search.toLowerCase();return !q||w.name.toLowerCase().includes(q)||w.producer.toLowerCase().includes(q);});
    const base = filtroAtivo==="Todos"?winesAtivos
      :filtroAtivo==="Especial"?winesAtivos.filter(w=>w.special)
      :tipos.includes(filtroAtivo)?winesAtivos.filter(w=>w.style===filtroAtivo)
      :filtroCasta.includes(filtroAtivo)?winesAtivos.filter(w=>getCastaFiltro(w.grapes)===filtroAtivo)
      :filtrosPais.includes(filtroAtivo)?winesAtivos.filter(w=>w.country===filtroAtivo)
      :winesAtivos;
    return base.filter(w=>{const q=search.toLowerCase();return !q||w.name.toLowerCase().includes(q)||w.producer.toLowerCase().includes(q);});
  })();

  const total = winesAtivos.reduce((a,b)=>a+b.bottles,0);
  const contaTipo = t => t==="Especial"?winesAtivos.filter(w=>w.special).length:winesAtivos.filter(w=>w.style===t).length;
  const contaCasta = c => winesAtivos.filter(w=>getCastaFiltro(w.grapes)===c).length;
  const contaPais = p => winesAtivos.filter(w=>w.country===p).length;

  if(detail){const live=wines.find(w=>w.id===detail.id)||detail;
    return <WineDetail w={live} onBack={()=>setDetail(null)} onUpdate={update} onDelete={id=>{setWines(ws=>ws.filter(w=>w.id!==id));setDetail(null);}}/>;
  }

  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      {adding&&<AddWine onClose={()=>setAdding(false)} onSave={w=>{setWines(p=>[...p,w]);setAdding(false);}} />}

      <div style={{padding:"32px 24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8}}>ADEGA</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,color:C.text,lineHeight:1}}>
              {winesAtivos.length} <span style={{color:C.muted,fontSize:24}}>rótulos</span>
            </div>
            <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginTop:4}}>{total} garrafas · {winesDegustados.length} degustados</div>
          </div>
          <button onClick={()=>setAdding(true)} style={{background:C.goldD,border:"none",borderRadius:"50%",width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:22,boxShadow:"0 2px 16px rgba(154,122,74,0.35)"}}>+</button>
        </div>

      </div>

      {filtroAtivo ? (
        <div>
          <div style={{padding:"0 24px",marginBottom:14}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
              <button onClick={()=>{setFiltroAtivo(null);setSearch("");}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:20,padding:"6px 14px",fontFamily:"'DM Sans'",fontSize:10,color:C.muted,cursor:"pointer",letterSpacing:"0.08em"}}>← Filtros</button>
              <span style={{fontFamily:"'DM Sans'",fontSize:10,color:filtroAtivo==="Degustados"?C.sepia:C.goldD,background:filtroAtivo==="Degustados"?C.sepiaL:C.goldL,padding:"6px 14px",borderRadius:20,letterSpacing:"0.08em"}}>
                {filtroAtivo} · {winesFiltrados.length}
              </span>
            </div>
            <div style={{position:"relative"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 14px 10px 36px",color:C.text,fontFamily:"'DM Sans'",fontSize:13,outline:"none",boxSizing:"border-box"}} />
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:13}}>🔍</span>
            </div>
          </div>
          <div style={{padding:"0 24px"}}>
            {winesFiltrados.length===0
              ?<div style={{textAlign:"center",padding:"72px 0",fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.muted}}>Nenhum vinho encontrado</div>
              :winesFiltrados.map(w=>{
                const isDeg=w.bottles===0;
                const corTipo=isDeg?C.sepia:sAccent(w.style);
                const corBg=isDeg?C.sepiaL:sLabel(w.style);
                return (
                  <div key={w.id} onClick={()=>setDetail(w)} style={{background:C.card,border:`1px solid ${isDeg?"rgba(122,92,58,0.2)":C.border}`,borderRadius:10,marginBottom:10,cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"stretch"}}>
                    {/* Faixa lateral colorida — indica tipo */}
                    <div style={{width:4,background:corTipo,flexShrink:0,opacity:isDeg?0.6:1}} />
                    {/* Conteúdo principal */}
                    <div style={{flex:1,padding:"14px 16px",minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:4}}>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:300,color:C.text,lineHeight:1.2,flex:1}}>{w.name}</div>
                        <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                          <span style={{fontSize:11}}>❤️</span>
                          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:isDeg?C.sepia:C.goldD,fontWeight:300,lineHeight:1}}>{w.rating}</span>
                        </div>
                      </div>
                      <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:12}}>{w.producer} · {w.vintage}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                        <div style={{display:"flex",flexDirection:"column",gap:7,alignItems:"flex-start"}}>
                          <span style={{fontFamily:"'DM Sans'",fontSize:9,color:corTipo,background:corBg,padding:"3px 10px",borderRadius:3,letterSpacing:"0.18em",textTransform:"uppercase",fontWeight:500}}>{isDeg?"Degustado":w.style}</span>
                          {!isDeg&&<button onClick={(e)=>{e.stopPropagation();update({...w,special:!w.special});}} style={{background:"none",border:"none",padding:0,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontSize:13,color:w.special?C.gold:"rgba(125,98,56,0.4)",lineHeight:1}}>{w.special?"★":"☆"}</span>
                            <span style={{fontFamily:"'DM Sans'",fontSize:9,color:w.special?C.goldD:"rgba(125,98,56,0.55)",letterSpacing:"0.18em",textTransform:"uppercase",fontWeight:w.special?500:400}}>Especial</span>
                          </button>}
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <button
                            onClick={(e)=>{e.stopPropagation();remove(w.id,w.name);}}
                            aria-label={`Remover ${w.name}`}
                            style={{background:"none",border:"none",padding:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:0.55,transition:"opacity 0.2s"}}
                            onMouseEnter={(e)=>e.currentTarget.style.opacity=1}
                            onMouseLeave={(e)=>e.currentTarget.style.opacity=0.55}
                          >
                            <IconeLixeira cor={C.muted} />
                          </button>
                          {!isDeg&&<Qty value={w.bottles} onChange={v=>update({...w,bottles:v})} accent={C.goldD} />}
                        </div>
                      </div>
                    </div>
                    {/* Foto pequena à direita (se existir) */}
                    {w.photos?.[0]&&(
                      <img src={cldUrl(w.photos[0],140)} loading="lazy" style={{width:70,objectFit:"cover",flexShrink:0,filter:isDeg?"sepia(40%)":"none"}} />
                    )}
                  </div>
                );
              })
            }
          </div>
        </div>
      ):(
        <div style={{padding:"0 24px"}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>POR TIPO</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
            {[{label:"Tinto",cor:C.wine},{label:"Branco",cor:C.goldD},{label:"Rose",cor:"#B05070"},{label:"Espumante",cor:C.green},{label:"Especial",cor:C.gold,dark:true},{label:"Todos",cor:C.muted}].map(({label,cor,dark})=>{
              const count=label==="Todos"?winesAtivos.length:contaTipo(label);
              return (
                <button key={label} onClick={()=>setFiltroAtivo(label)} style={{background:dark?"#1A1410":C.card,border:dark?"none":`1px solid ${C.border}`,borderRadius:8,padding:"18px 16px",display:"flex",flexDirection:"column",cursor:"pointer",textAlign:"left",gap:6}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,color:cor,display:"flex",alignItems:"baseline",gap:7}}>
                    {dark&&<span style={{fontSize:14}}>★</span>}
                    <span>{label}</span>
                  </div>
                  <div style={{fontFamily:"'DM Sans'",fontSize:9,color:dark?"rgba(242,237,226,0.7)":C.muted,letterSpacing:"0.06em"}}>{count} rótulo{count!==1?"s":""}</div>
                </button>
              );
            })}
          </div>

          {/* Card Degustados — mesmo formato dos outros, só fundo dourado */}
          <button onClick={()=>setFiltroAtivo("Degustados")} style={{width:"100%",background:C.gold,border:"none",borderRadius:8,padding:"18px 16px",display:"flex",flexDirection:"column",cursor:"pointer",textAlign:"left",gap:6,marginBottom:32}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,color:"#FFFFFF"}}>Degustados</div>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:"rgba(255,255,255,0.92)",letterSpacing:"0.06em"}}>{winesDegustados.length} rótulo{winesDegustados.length!==1?"s":""}</div>
          </button>

          {filtroCasta.length>0&&<>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>POR CASTA</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:32}}>
              {filtroCasta.map(c=>(
                <button key={c} onClick={()=>setFiltroAtivo(c)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:C.text,fontStyle:c==="Blend"?"italic":"normal"}}>{c}</span>
                  <span style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted}}>{contaCasta(c)} rótulo{contaCasta(c)!==1?"s":""}</span>
                </button>
              ))}
            </div>
          </>}

          {filtrosPais.length>0&&<>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>POR PAÍS</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
              {filtrosPais.map(p=>(
                <button key={p} onClick={()=>setFiltroAtivo(p)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:C.text}}>{p}</span>
                  <span style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted}}>{contaPais(p)} rótulo{contaPais(p)!==1?"s":""}</span>
                </button>
              ))}
            </div>
          </>}
        </div>
      )}
    </div>
  );
};

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [capa, setCapa] = useState(true);
  const [tab, setTab] = useState("adega");
  const [wines, setWines] = useState([]);
  const [vinhoParaAbrir, setVinhoParaAbrir] = useState(null);
  const [vineyard] = useState(VINHO0);
  const [memories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    loadFromServer().then(data=>{
      if(data){
        setWines(data.wines||[]);
      }
      setLoading(false);
    });
  },[]);

  useEffect(()=>{
    if(loading) return;
    saveToServer({wines,vineyard,memories});
  },[wines,loading]);

  const tabs=[{id:"adega",label:"Adega"},{id:"mapa",label:"Mapa"},{id:"memorias",label:"Memórias"}];

  if(loading) return (
    <div style={{maxWidth:430,margin:"0 auto",height:"100vh",background:"#0D0D0F",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{G}</style>
      <IconeKV nome="adega" cor="#C9A46E" tamanho={56} />
    </div>
  );

  if(capa) return (
    <>
      <style>{G}</style>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#0D0D0F}`}</style>
      <div style={{maxWidth:430,margin:"0 auto",height:"100vh",position:"relative"}}>
        <Capa onEntrar={()=>setCapa(false)} />
      </div>
    </>
  );

  return (
    <div style={{maxWidth:430,margin:"0 auto",height:"100vh",background:C.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <style>{G}</style>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{display:none}input,textarea,select{-webkit-appearance:none}::placeholder{color:#C4BAB0}body{background:#F7F3EE}`}</style>

      {/* Header — fundo preto KV, símbolo cacho puro sem moldura */}
      <div style={{padding:"16px 24px 14px",borderBottom:"1px solid rgba(201,164,110,0.15)",background:"#0D0D0F",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <IconeKV nome="adega" cor="#C9A46E" tamanho={24} />
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,letterSpacing:"0.18em",color:"#F2EDE2"}}>MEMORAVIN</span>
        </div>
        <div style={{fontFamily:"'DM Sans'",fontSize:8,color:"#C9A46E",letterSpacing:"0.18em",textTransform:"uppercase"}}>Adega & Memórias</div>
      </div>

      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {tab==="adega"&&<TabAdega wines={wines} setWines={setWines} vinhoParaAbrir={vinhoParaAbrir} onAbriu={()=>setVinhoParaAbrir(null)} />}
        {tab==="mapa"&&<TabMapa wines={wines} onOpenWine={(w)=>{setVinhoParaAbrir(w);setTab("adega");}} />}
        {tab==="memorias"&&<TabMemorias wines={wines} />}
      </div>

      {/* Rodapé — fundo preto KV, ícones SVG no estilo da marca */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:"#0D0D0F",borderTop:"1px solid rgba(201,164,110,0.15)",paddingTop:"12px",paddingBottom:"calc(14px + env(safe-area-inset-bottom))",display:"flex",justifyContent:"space-around",zIndex:40}}>
        {tabs.map(t=>{
          const ativo = tab===t.id;
          const cor = ativo ? "#C9A46E" : "rgba(201,164,110,0.7)";
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,flex:1,padding:0}}>
              <IconeKV nome={t.id} cor={cor} />
              <span style={{fontFamily:"'DM Sans'",fontSize:8,letterSpacing:"0.18em",textTransform:"uppercase",color:cor,fontWeight:ativo?500:300}}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
