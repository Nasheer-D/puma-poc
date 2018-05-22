INSERT INTO public.credit_packages(
	"packageID", "ownerID", amount, "bonusCredits", "bonusTickets", featured, "priceInUSD", title, description)
	VALUES ('package01', 'owner01', 10, 0, 0, false, 15, 'Basic', 'Basic Credits Package');

INSERT INTO public.credit_packages(
	"packageID", "ownerID", amount, "bonusCredits", "bonusTickets", featured, "priceInUSD", title, description)
	VALUES ('package02', 'owner01', 25, 2, 1, false, 20, 'Pro', 'Pro Credits Package');

INSERT INTO public.credit_packages(
	"packageID", "ownerID", amount, "bonusCredits", "bonusTickets", featured, "priceInUSD", title, description)
	VALUES ('package03', 'owner01', 50, 10, 2, true, 35, 'Premium', 'Premium Credits Package');        

INSERT INTO public.credit_packages(
	"packageID", "ownerID", amount, "bonusCredits", "bonusTickets", featured, "priceInUSD", title, description)
	VALUES ('package04', 'owner01', 100, 20, 4, false, 65, 'Elite', 'Elite Credits Package');    