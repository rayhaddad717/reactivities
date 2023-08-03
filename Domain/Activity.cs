namespace Domain
{
    public class Activity
    {
        //needs to be specifically called id for the entity framework
        public Guid Id { get; set; }
        
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
    }
}